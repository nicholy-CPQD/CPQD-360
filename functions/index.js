const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { HttpsError, onCall } = require('firebase-functions/v2/https');

initializeApp();

const auth = getAuth();
const db = getFirestore();
const users = db.collection('usuarios');

const PROFILE_SCOPES = {
  admin_geral: ['global'],
  restaurante: ['leCafe', 'thiane', 'laranjaLima', 'villani'],
  telecamp: ['telecamp'],
  polis: ['polis'],
};

function isValidUserProfile(profile) {
  return Boolean(
    profile &&
    typeof profile.nome === 'string' && profile.nome.trim().length > 0 && profile.nome.trim().length <= 120 &&
    typeof profile.email === 'string' && profile.email.trim() &&
    typeof profile.perfil === 'string' &&
    typeof profile.escopo === 'string' &&
    ['ativo', 'bloqueado'].includes(profile.status) &&
    PROFILE_SCOPES[profile.perfil]?.includes(profile.escopo)
  );
}

function isActiveAdminGeneral(profile) {
  return profile?.perfil === 'admin_geral' &&
    profile.escopo === 'global' &&
    profile.status === 'ativo';
}

async function requireActiveAdminGeneral(uid) {
  const snapshot = await users.doc(uid).get();
  if (!snapshot.exists || !isActiveAdminGeneral(snapshot.data())) {
    throw new HttpsError('permission-denied', 'Only an active Admin Geral can manage users.');
  }
}

function requireObjectWithKeys(data, requiredKeys, allowedKeys = requiredKeys) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new HttpsError('invalid-argument', 'Invalid user data.');
  }

  const keys = Object.keys(data);
  if (!requiredKeys.every(key => keys.includes(key)) || keys.some(key => !allowedKeys.includes(key))) {
    throw new HttpsError('invalid-argument', 'Invalid user fields.');
  }
}

function validateProfileFields(profile) {
  if (!isValidUserProfile(profile)) {
    throw new HttpsError('invalid-argument', 'Name, email, profile, scope, or status is invalid.');
  }
}

function mapAuthCreationError(error) {
  if (error.code === 'auth/email-already-exists') {
    return new HttpsError('already-exists', 'An account already exists with this email.');
  }
  if (error.code === 'auth/invalid-email') {
    return new HttpsError('invalid-argument', 'The email address is invalid.');
  }
  return new HttpsError('internal', 'Unable to create the authentication account.');
}

exports.createAdminUser = onCall(async request => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in to the administrative panel first.');
  }

  const input = request.data;
  requireObjectWithKeys(input, ['nome', 'email', 'perfil', 'escopo']);

  const profile = {
    nome: typeof input.nome === 'string' ? input.nome.trim() : input.nome,
    email: typeof input.email === 'string' ? input.email.trim().toLowerCase() : input.email,
    perfil: input.perfil,
    escopo: input.escopo,
    status: 'ativo',
  };
  validateProfileFields(profile);

  await requireActiveAdminGeneral(request.auth.uid);

  let authUser;
  let createdAuthUser = false;
  try {
    try {
      authUser = await auth.getUserByEmail(profile.email);
    } catch (lookupError) {
      if (lookupError.code !== 'auth/user-not-found') throw lookupError;
      try {
        // No password is assigned; the client requests a Firebase reset email after provisioning.
        authUser = await auth.createUser({
          email: profile.email,
          displayName: profile.nome,
        });
        createdAuthUser = true;
      } catch (createError) {
        // A concurrent request may have created the same Auth identity first.
        if (createError.code !== 'auth/email-already-exists') throw createError;
        authUser = await auth.getUserByEmail(profile.email);
      }
    }

    if (authUser.disabled) {
      throw new HttpsError('failed-precondition', 'The existing Firebase Auth account is disabled.');
    }
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    throw mapAuthCreationError(error);
  }

  try {
    const userRef = users.doc(authUser.uid);
    const callerRef = users.doc(request.auth.uid);

    await db.runTransaction(async transaction => {
      const callerSnapshot = await transaction.get(callerRef);
      if (!callerSnapshot.exists || !isActiveAdminGeneral(callerSnapshot.data())) {
        throw new HttpsError('permission-denied', 'Admin Geral access is no longer active.');
      }

      const [emailSnapshot, userSnapshot] = await Promise.all([
        transaction.get(users.where('email', '==', authUser.email).limit(1)),
        transaction.get(userRef),
      ]);
      if (!emailSnapshot.empty || userSnapshot.exists) {
        throw new HttpsError('already-exists', 'An administrative profile already exists for this email or account.');
      }

      transaction.create(userRef, {
        nome: profile.nome,
        email: authUser.email,
        perfil: profile.perfil,
        escopo: profile.escopo,
        status: 'ativo',
      });
    });
  } catch (error) {
    if (createdAuthUser) {
      try {
        await auth.deleteUser(authUser.uid);
      } catch (cleanupError) {
        console.error('Could not remove Auth user after profile creation failed:', cleanupError);
      }
    }

    if (error instanceof HttpsError) throw error;
    console.error('Could not write administrative user profile:', error);
    throw new HttpsError('internal', 'Unable to finish administrative user creation.');
  }

  return { uid: authUser.uid, email: authUser.email };
});

exports.updateAdminUser = onCall(async request => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in to the administrative panel first.');
  }

  const input = request.data;
  requireObjectWithKeys(input, ['uid', 'nome', 'perfil', 'escopo', 'status']);

  if (typeof input.uid !== 'string' || !input.uid || input.uid === request.auth.uid) {
    throw new HttpsError('permission-denied', 'You cannot modify your own administrative profile.');
  }

  const fields = {
    nome: typeof input.nome === 'string' ? input.nome.trim() : input.nome,
    perfil: input.perfil,
    escopo: input.escopo,
    status: input.status,
  };

  if (
    typeof fields.nome !== 'string' || !fields.nome ||
    typeof fields.perfil !== 'string' ||
    typeof fields.escopo !== 'string' ||
    !['ativo', 'bloqueado'].includes(fields.status) ||
    !PROFILE_SCOPES[fields.perfil]?.includes(fields.escopo)
  ) {
    throw new HttpsError('invalid-argument', 'Name, profile, scope, or status is invalid.');
  }

  const callerRef = users.doc(request.auth.uid);
  const targetRef = users.doc(input.uid);

  await db.runTransaction(async transaction => {
    const [callerSnapshot, targetSnapshot] = await Promise.all([
      transaction.get(callerRef),
      transaction.get(targetRef),
    ]);

    if (!callerSnapshot.exists || !isActiveAdminGeneral(callerSnapshot.data())) {
      throw new HttpsError('permission-denied', 'Only an active Admin Geral can manage users.');
    }
    if (!targetSnapshot.exists) {
      throw new HttpsError('not-found', 'Administrative user was not found.');
    }

    const currentProfile = targetSnapshot.data();
    const nextProfile = { ...currentProfile, ...fields };
    validateProfileFields(nextProfile);

    const removesActiveAdmin = isActiveAdminGeneral(currentProfile) &&
      !isActiveAdminGeneral(nextProfile);

    if (removesActiveAdmin) {
      const adminCandidates = await transaction.get(
        users.where('perfil', '==', 'admin_geral')
      );
      const activeGlobalAdmins = adminCandidates.docs.filter(snapshot =>
        isActiveAdminGeneral(snapshot.data())
      );

      if (activeGlobalAdmins.length <= 1) {
        throw new HttpsError(
          'failed-precondition',
          'The last active Admin Geral cannot be blocked or lose the global profile or scope.'
        );
      }
    }

    transaction.update(targetRef, fields);
  });

  return { uid: input.uid, ...fields };
});
