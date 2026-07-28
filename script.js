document.addEventListener('DOMContentLoaded', function() {

    // --- 1. CONFIGURAÇÃO BASE DO MAPA ---
    const imageUrl = './img/campus_map_base.png'; // Substitua pela sua imagem quando tiver
    const imageW = 1920; 
    const imageH = 1080;

    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 2,
        zoomControl: false,
        attributionControl: false // Remove a bandeira da Ucrânia / marca do Leaflet
    });

    const bounds = [[0, 0], [imageH, imageW]];

    // Tenta carregar a imagem se existir
    if (imageUrl) {
        L.imageOverlay(imageUrl, bounds).addTo(map);
    }
    
    map.setMaxBounds(bounds);
    map.fitBounds(bounds);

    // --- 2. BASE DE DADOS DOS PRÉDIOS ---
    const prediosData = [
        {
            id: '02',
            nome: '02 - Administração',
            setor: 'Admin',
            pos: [350, 850],
            cor: '#00BFA5',
            popup: '<h3>Administração</h3><p>Prédio administrativo central do CPQD.</p>'
        },
        {
            id: '04',
            nome: '04 - Financeiro e Corporativo',
            setor: 'Financeiro',
            pos: [250, 980],
            cor: '#00BFA5',
            popup: '<h3>Financeiro</h3><p>Setor corporativo e financeiro.</p>'
        },
        {
            id: '05',
            nome: '05 - Auditório',
            setor: 'Auditório',
            pos: [480, 780],
            cor: '#FDD835',
            popup: '<h3>Auditório Principal</h3><p>Espaço para eventos e conferências.</p>'
        },
        {
            id: '12',
            nome: '12 - Laboratório CFOA',
            setor: 'Laboratórios',
            pos: [450, 1250],
            cor: '#FFA726',
            popup: `
                <div class="custom-popup-header"><h2>Prédio 12 - Laboratórios</h2></div>
                <div class="custom-popup-body">
                    <p><strong>LABORATÓRIO L-12 CFOA</strong><br>Realizam teste para homologação de cabos e fibras.</p>
                    <hr>
                    <p><strong>LABORATÓRIOS ENSAIOS CLIMÁTICOS</strong><br>Simulação de clima para fibras ópticas.</p>
                    <button class="popup-details-btn">Ver Detalhes Completos</button>
                </div>`
        },
        {
            id: 'L04',
            nome: 'L-04 - Laboratório SARS',
            setor: 'Laboratórios',
            pos: [800, 1500],
            cor: '#FFA726',
            popup: '<h3>Laboratório SARS</h3><p>Pesquisa e desenvolvimento avançado.</p>'
        },
        {
            id: '13',
            nome: '13 - Laboratório de Calibração',
            setor: 'Laboratórios',
            pos: [750, 700],
            cor: '#FFA726',
            popup: '<h3>Laboratório de Calibração</h3><p>Serviços de medição e calibração de precisão.</p>'
        }
    ];

    // --- 3. CRIAÇÃO DOS MARCADORES ---
    const markersGroup = {};

    prediosData.forEach(p => {
        const iconHtml = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${p.cor}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${p.id}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const marker = L.marker(p.pos, { icon: iconHtml }).addTo(map);
        marker.bindPopup(p.popup, { maxWidth: 320 });
        
        marker.setor = p.setor;
        marker.nome = p.nome;

        markersGroup[p.id] = marker;
    });

    // --- 4. INTERAÇÃO COM A LISTA LATERAL ---
    const listItems = document.querySelectorAll('.building-list li');
    
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.innerText;
            const predioObj = prediosData.find(p => text.includes(p.nome) || text.startsWith(p.id));

            if (predioObj && markersGroup[predioObj.id]) {
                const targetMarker = markersGroup[predioObj.id];
                map.flyTo(targetMarker.getLatLng(), 1);
                targetMarker.openPopup();

                listItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- 5. FILTROS POR SETOR (TAGS) ---
    const tagButtons = document.querySelectorAll('.tag-btn');

    tagButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tagButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const categoria = this.innerText.trim();

            Object.values(markersGroup).forEach(marker => {
                if (categoria === 'Todos' || marker.setor === categoria) {
                    map.addLayer(marker);
                } else {
                    map.removeLayer(marker);
                }
            });
        });
    });

    // --- 6. BARRA DE PESQUISA MINIMALISTA ---
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchResultsList = document.getElementById('search-results-list');

    if (searchToggleBtn && searchContainer) {
        searchToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            searchContainer.classList.toggle('active');

            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                searchResultsList.classList.remove('has-results');
            }
        });

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            searchResultsList.innerHTML = '';

            if (query === '') {
                searchResultsList.classList.remove('has-results');
                return;
            }

            const correspondentes = prediosData.filter(p => 
                p.nome.toLowerCase().includes(query) || p.id.toLowerCase().includes(query)
            );

            if (correspondentes.length > 0) {
                searchResultsList.classList.add('has-results');
                
                correspondentes.forEach(p => {
                    const li = document.createElement('li');
                    li.textContent = p.nome;
                    li.addEventListener('click', function() {
                        if (markersGroup[p.id]) {
                            const targetMarker = markersGroup[p.id];
                            map.flyTo(targetMarker.getLatLng(), 1);
                            targetMarker.openPopup();
                            
                            searchContainer.classList.remove('active');
                            searchResultsList.classList.remove('has-results');
                            searchInput.value = '';
                        }
                    });
                    searchResultsList.appendChild(li);
                });
            } else {
                searchResultsList.classList.remove('has-results');
            }
        });

        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                searchContainer.classList.remove('active');
                searchResultsList.classList.remove('has-results');
            }
        });
    }

    // --- 7. BOTÃO RESET ---
    const resetBtn = document.getElementById('reset-map-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            map.fitBounds(bounds);
        });
    }

});