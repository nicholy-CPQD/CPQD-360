document.addEventListener('DOMContentLoaded', function() {

    // --- 1. CONFIGURAÇÃO BASE DO MAPA ---
    const imageUrl = './img/Mapa base.svg';
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
            pos: [224, 732],
            pinUrl: './img/Pin 02.svg',
            pinHoverUrl: './img/Pin 02 hover.svg',
            predioUrl: './img/Prédio 2.svg',
            predioHoverUrl: './img/Prédio 02 hover.svg',
            predioBounds: [[210, 597], [277, 750]],
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
            setor: 'Financeiro',
            pos: [160, 899],
            pinUrl: './img/Pin 04.svg',
            pinHoverUrl: './img/Pin 04 hover.svg',
            predioUrl: './img/Prédio 4.svg',
            predioHoverUrl: './img/Prédio 04 hover.svg',
            predioBounds: [[337, 935], [147, 815]],
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
            pos: [459, 708],
            pinUrl: './img/Pin 05.svg',
            pinHoverUrl: './img/Pin 05 hover.svg',
            predioUrl: './img/Prédio 5 - auditorio.svg',
            predioHoverUrl: './img/Prédio 5 - hover.svg',
            predioBounds: [[575, 726], [440, 630]],
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
            pos: [418, 1205],
            pinUrl: './img/Pin 12.svg',
            pinHoverUrl: './img/Pin 12 hover.svg',
            predioUrl: './img/Prédio 12.svg',
            predioHoverUrl: './img/Prédio 12 hover.svg',
            predioBounds: [[615, 1215], [400, 920]],
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
            pos: [820, 1480],
            pinUrl: './img/Pin L4.svg',
            pinHoverUrl: './img/Pin L4 hover.svg',
            predioUrl: './img/Prédio L - 04.svg',
            predioHoverUrl: './img/Prédio L - 04 hover.svg',
            predioBounds: [[1000, 1500], [800, 1400]],
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
            pos: [798, 595],
            pinUrl: './img/Pin 13.svg',
            pinHoverUrl: './img/Pin 13 hover.svg',
            predioUrl: './img/Prédio 13.svg',
            predioHoverUrl: './img/Prédio 13 hover.svg',
            predioBounds: [[951, 608], [768, 447]],
            popup: `
                <div class="custom-popup-header"><h2>Prédio 13 - Laboratórios</h2></div>
                <div class="custom-popup-body">
                    <p><strong>L-13 - LABORATÓRIOS DE CALIBRAÇÃO</strong><br>Serviços de medição e calibração de precisão.</p>
                    <hr>
                    <p><strong>GTEM</strong><br>Calibração mediadores de radiação não ionizantes e eletromagnético.</p>
                    <button class="popup-details-btn">Ver Detalhes Completos</button>
                </div>
            `
        },
        {
            id: 'portaria',
            nome: 'Portaria',
            predioUrl: './img/Portaria.svg',
            predioBounds: [[55, 633], [11, 723]]
        },
        {
            id: 'techoa',
            nome: 'Techoa',
            predioUrl: './img/prédio (1).svg',
            predioBounds: [[335, 140], [147, 815]]
        },
        {
            id: 'll',
            nome: 'Laranja Lima',
            predioUrl: './img/prédio.svg',
            predioBounds: [[745, 624], [610, 726]]
        }
    ];

    // --- 3. CRIAÇÃO DOS MARCADORES ---
    const markersGroup = {};

    prediosData.forEach(p => {
        let predioNormal = null;
        let predioHover = null;

        // 1. CARREGA AS IMAGENS DO PRÉDIO
        if (p.predioUrl && p.predioBounds) {
            predioNormal = L.imageOverlay(p.predioUrl, p.predioBounds, {
                opacity: 1, 
                interactive: false 
            }).addTo(map);

            if (p.predioHoverUrl) {
                predioHover = L.imageOverlay(p.predioHoverUrl, p.predioBounds, {
                    opacity: 0, 
                    interactive: false
                }).addTo(map);
            }
        }

        // 2. CRIA O PINO E A INTERATIVIDADE APENAS SE HOUVER COORDENADA (p.pos)
        if (p.pos) {
            const iconNormal = L.icon({ iconUrl: p.pinUrl, iconSize: [40, 40], iconAnchor: [20, 25], popupAnchor: [0, -40] }); // Ajusta o teu anchor aqui
            const iconHover = L.icon({ iconUrl: p.pinHoverUrl, iconSize: [40, 40], iconAnchor: [20, 25], popupAnchor: [0, -40] });

            const marker = L.marker(p.pos, { icon: iconNormal }).addTo(map);
            if (p.popup) marker.bindPopup(p.popup, { maxWidth: 320 });
            
            marker.on('mouseover', function() {
                this.setIcon(iconHover);
                if (predioNormal && p.predioHoverUrl) predioNormal.setOpacity(0); 
                if (predioHover) predioHover.setOpacity(1);   
            });
            
            marker.on('mouseout', function() {
                if (!this.isPopupOpen()) {
                    this.setIcon(iconNormal);
                    if (predioNormal && p.predioHoverUrl) predioNormal.setOpacity(1); 
                    if (predioHover) predioHover.setOpacity(0);   
                }
            });

            marker.on('popupopen', function() {
                this.setIcon(iconHover);
                if (predioNormal && p.predioHoverUrl) predioNormal.setOpacity(0);
                if (predioHover) predioHover.setOpacity(1);
            });

            marker.on('popupclose', function() {
                this.setIcon(iconNormal);
                if (predioNormal && p.predioHoverUrl) predioNormal.setOpacity(1);
                if (predioHover) predioHover.setOpacity(0);
            });

            marker.setor = p.setor;
            marker.nome = p.nome;
            markersGroup[p.id] = marker;
        }
    });

    // --- ABRIR E FECHAR O PAINEL LATERAL ---
    const sidebar = document.querySelector('.map-sidebar');
    const sidebarContent = document.getElementById('map-sidebar-content');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileSidebarQuery = window.matchMedia('(max-width: 768px)');

    if (sidebar && sidebarContent && sidebarToggle) {
        const setSidebarCollapsed = collapsed => {
            sidebar.classList.toggle('collapsed', collapsed);
            sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
            sidebarToggle.setAttribute('aria-label', collapsed ? 'Abrir menu lateral' : 'Fechar menu lateral');
            sidebarContent.toggleAttribute('inert', collapsed);
            sidebarContent.setAttribute('aria-hidden', String(collapsed));
        };

        sidebar.addEventListener('transitionend', function(event) {
            if (event.target === sidebar && event.propertyName === 'transform') {
                map.invalidateSize({ pan: false });
            }
        });

        sidebarToggle.addEventListener('click', function() {
            setSidebarCollapsed(!sidebar.classList.contains('collapsed'));
        });

        const handleMobileSidebarChange = event => setSidebarCollapsed(event.matches);
        if (mobileSidebarQuery.addEventListener) {
            mobileSidebarQuery.addEventListener('change', handleMobileSidebarChange);
        } else {
            mobileSidebarQuery.addListener(handleMobileSidebarChange);
        }

        setSidebarCollapsed(mobileSidebarQuery.matches);
    }

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
            map.closePopup();       // fecha qualquer popup aberto
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
