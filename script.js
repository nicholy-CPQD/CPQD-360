document.addEventListener('DOMContentLoaded', function() {

    // --- 1. CONFIGURAÇÃO BASE DO MAPA ---
    const imageUrl = './img/Fundo.svg'; // Substitua pela sua imagem quando tiver
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

    // --- MOSTRAR CORDENADAS---
    map.on('click', function(e) {
        const y = Math.round(e.latlng.lat);
        const x = Math.round(e.latlng.lng);
        
        L.popup()
            .setLatLng(e.latlng)
            .setContent(`<b>Coordenadas:</b><br>[${y}, ${x}]`)
            .openOn(map);
            
        console.log(`Coordenadas clicadas: [${y}, ${x}]`);
    });

    // ------------------------------------------------

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
            popup: '<h3>Administração</h3><p>Prédio administrativo central do CPQD.</p>'
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
            popup: '<h3>Financeiro</h3><p>Setor corporativo e financeiro.</p>'
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
            popup: '<h3>Auditório Principal</h3><p>Espaço para eventos e conferências.</p>'
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
            popup: `...` 
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
            popup: '<h3>Laboratório SARS</h3><p>Pesquisa e desenvolvimento avançado.</p>'
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
            popup: '<h3>Laboratório de Calibração</h3><p>Serviços de medição e calibração de precisão.</p>'
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
