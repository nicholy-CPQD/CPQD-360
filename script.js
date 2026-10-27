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

    // A imagem-base é uma dependência do projeto. Não há substituto visual
    // enquanto o asset original não estiver disponível.
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
            popup: `
                <div class="custom-popup-header"><h2>Prédio 02 - Administração</h2></div>
                <div class="custom-popup-body">
                    <p><strong>1º Andar</strong><br>Prédio administrativo central do CPQD (RH, Facilites, Segurança do Trabalho).</p>
                    <hr>
                    <p><strong>2ª andar</strong><br>Destinado a presidência e jurídico do CPQD.</p>
                    <button class="popup-details-btn">Ver Detalhes Completos</button>
                </div>
                `
                
        },
        {
            id: '04',
            nome: '04 - Financeiro e Corporativo',
            setor: 'Corporativo',
            pos: [250, 980],
            cor: '#00BFA5',
            popup: `
                <div class="custom-popup-header"><h2>Prédio 04 - Corporativo e Financeiro</h2></div>
                <div class="custom-popup-body">
                    <p><strong>Financeiro</strong><br>Prédio responsável pelo setor financeiro e comercial.</p>
                    <hr>
                    <p><strong>Corporativo</strong><br>Responsável por atividades do setor corporativo (DPS, DTIN, DGTIC).</p>
                    <button class="popup-details-btn">Ver Detalhes Completos</button>
                </div>
            `
        },
        {
            id: '05',
            nome: '05 - Auditório',
            setor: 'Auditório',
            pos: [480, 780],
            cor: '#FDD835',
            popup: `
                <div class="custom-popup-header"><h3>Auditório Principal</h3></div>
                <div class="custom-popup-body">
                    <p><strong>Auditório</strong><br>Sala ampla voltada a eventos corporativos, conferências e cerimônias.</p>
                    <hr>
                    <p><strong>Anfiteatro</strong><br>Espaço semicircular em desnível para aulas, palestras e apresentações.</p>
                    <button class="popup-details-btn">Ver Detalhes Completos</button>
                </div>
            `
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
                </div>
                `
        },
        {
            id: 'L04',
            nome: 'L-04 - Laboratório SARS',
            setor: 'Laboratórios',
            pos: [800, 1500],
            cor: '#FFA726',
            popup: `
                <div class="custom-popup-header"><h3>Laboratório SARS</h3></div>
                <div class="custom-popup-body">
                    <p><strong>LABORATÓRIO DE ENSAIOS</strong><br>Realização de testes técnicos e controle de qualidade de materiais.</p>
                    <hr>
                    <p><strong>CERTIFICAÇÃO SARS</strong><br>Validação e conformidade com os padrões regulatórios SARS.</p>
                    <button class="popup-details-btn">Ver Detalhes Completos</button>
                </div>
            `
        },
        {
            id: '13',
            nome: '13 - Laboratório de Calibração',
            setor: 'Laboratórios',
            pos: [750, 700],
            cor: '#FFA726',
            popup: `
                <div class="custom-popup-header"><h2>Prédio 13 - Laboratórios</h2></div>
                <div class="custom-popup-body">
                    <p><strong>L-13 - LABORATÓRIOS DE CALIBRAÇÃO</strong><br>Serviços de medição e calibração de precisão.</p>
                    <hr>
                    <p><strong>GTEM</strong><br>Calibração mediadores de radiação não ionizantes e eletromagnético.</p>
                    <button class="popup-details-btn">Ver Detalhes Completos</button>
                    </div>`
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
    const searchInput = document.getElementById('search-input');
    const searchResultsList = document.getElementById('search-results-list');

    if (searchInput && searchResultsList) {
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
            if (!searchInput.closest('.map-sidebar').contains(e.target)) {
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

    // Navegação direta para uma localização já cadastrada no mapa. Parâmetros
    // sem correspondência são preservados na URL, mas não geram pontos fictícios.
    const requestedLocation = new URLSearchParams(window.location.search).get('loc');
    if (requestedLocation) {
        const normalizedLocation = requestedLocation.trim().toLowerCase();
        const target = prediosData.find(p =>
            p.id.toLowerCase() === normalizedLocation ||
            p.nome.toLowerCase() === normalizedLocation
        );

        if (target && markersGroup[target.id]) {
            const marker = markersGroup[target.id];
            map.flyTo(marker.getLatLng(), 1);
            marker.openPopup();
        } else {
            console.warn(`Localização "${requestedLocation}" não possui ponto cadastrado no mapa.`);
        }
    }

});
