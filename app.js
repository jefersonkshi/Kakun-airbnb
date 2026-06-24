/**
 * KAKUN AIRBNB - INTERACTIVE WEB APPLICATION
 * Lógica principal para filtros, mapa de Leaflet, galería y navegación.
 */

// ==========================================================================
// 1. Datos de los Alojamientos y Puntos de Interés
// ==========================================================================
const ACCOMMODATIONS = [
    {
        id: "casa-mar-y-sol",
        name: "Casa Playa Mar y Sol",
        location: "Cieneguita, Puerto Cortés",
        locationKey: "cieneguita",
        capacity: 6,
        price: 85,
        image: "assets/images/beach_house_1.png",
        services: ["WiFi", "Aire acondicionado", "Cocina equipada", "Estacionamiento", "Acceso a la playa"],
        coords: [15.795, -87.915]
    },
    {
        id: "beach-paradise",
        name: "Beach Paradise Puerto Cortés",
        location: "Puerto Cortés",
        locationKey: "puerto-cortes",
        capacity: 8,
        price: 120,
        image: "assets/images/piscina_1.png",
        services: ["Piscina", "WiFi", "Aire acondicionado", "Vista al mar"],
        coords: [15.827, -87.947]
    },
    {
        id: "casa-familiar-cieneguita",
        name: "Casa Familiar Cieneguita",
        location: "Cieneguita",
        locationKey: "cieneguita",
        capacity: 4,
        price: 70,
        image: "assets/images/habitacion_1.png",
        services: ["Cocina", "WiFi", "Parqueo privado"],
        coords: [15.796, -87.910]
    },
    {
        id: "sunset-beach-house",
        name: "Sunset Beach House",
        location: "Puerto Cortés",
        locationKey: "puerto-cortes",
        capacity: 10,
        price: 150,
        image: "assets/images/beach_house_2.png",
        services: ["Piscina", "Área BBQ", "Vista al mar", "WiFi"],
        coords: [15.790, -88.020]
    }
];

const ATTRACTIONS = [
    {
        name: "Playa Cieneguita",
        coords: [15.794, -87.918],
        desc: "Playa tranquila de aguas cálidas, ideal para familias."
    },
    {
        name: "Puerto Cortés Centro",
        coords: [15.817, -87.937],
        desc: "Bahía portuaria, comercio, muelles y restaurantes locales."
    },
    {
        name: "Playa Coca-Cola",
        coords: [15.805, -87.962],
        desc: "Playa turística popular con excelente ambiente gastronómico."
    },
    {
        name: "Zona Turística de Omoa",
        coords: [15.792, -88.034],
        desc: "Castillo de San Fernando e increíbles playas y ríos cercanos."
    }
];

// WhatsApp Contact Details
const WHATSAPP_NUMBER = "50498527102";
const DEFAULT_MSG = "Hola, deseo obtener información sobre una reserva en Kakun Airbnb.";

// ==========================================================================
// 2. Inicialización de la Aplicación al Cargar el DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Iniciar Navbar y Drawer Móvil
    initNavigation();
    
    // Iniciar Renderizado de Alojamientos
    renderAccommodations(ACCOMMODATIONS);
    
    // Iniciar Filtros y Buscador
    initFilters();
    
    // Iniciar Mapa Interactivo
    initMap();
    
    // Iniciar Galería con Lightbox
    initGallery();
});

// ==========================================================================
// 3. Navbar y Drawer Móvil
// ==========================================================================
function initNavigation() {
    const header = document.getElementById("main-header");
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const drawerClose = document.getElementById("drawer-close");
    const drawerOverlay = document.getElementById("drawer-overlay");
    const drawerLinks = document.querySelectorAll(".drawer-link");
    const navLinks = document.querySelectorAll(".nav-link");

    // Efecto Scroll en la Cabecera
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Actualizar enlace activo en navbar según la sección en vista
        updateActiveLink();
    });

    // Menú Hamburguesa Móvil
    const openDrawer = () => {
        mobileDrawer.classList.add("open");
        drawerOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Desactivar scroll de fondo
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove("open");
        drawerOverlay.classList.remove("active");
        document.body.style.overflow = ""; // Reactivar scroll
    };

    mobileToggle.addEventListener("click", openDrawer);
    drawerClose.addEventListener("click", closeDrawer);
    drawerOverlay.addEventListener("click", closeDrawer);

    // Cerrar drawer al hacer clic en un enlace móvil
    drawerLinks.forEach(link => {
        link.addEventListener("click", closeDrawer);
    });

    // Navegación Activa Dinámica al hacer Scroll
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 120;
        
        document.querySelectorAll("section[id]").forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Escritorio nav links
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }
}

// ==========================================================================
// 4. Renderizado Dinámico de Alojamientos
// ==========================================================================
function renderAccommodations(items) {
    const container = document.getElementById("accommodations-container");
    const noResults = document.getElementById("no-results-msg");
    
    // Limpiar contenedor
    container.innerHTML = "";
    
    if (items.length === 0) {
        noResults.style.display = "block";
        container.style.display = "none";
        return;
    }
    
    noResults.style.display = "none";
    container.style.display = "grid";
    
    items.forEach((item, index) => {
        // Mapear iconos para servicios comunes
        const servicesHtml = item.services.map(service => {
            let iconClass = "fa-solid fa-circle-check";
            const sLower = service.toLowerCase();
            
            if (sLower.includes("wifi")) iconClass = "fa-solid fa-wifi";
            else if (sLower.includes("aire")) iconClass = "fa-solid fa-snowflake";
            else if (sLower.includes("cocina")) iconClass = "fa-solid fa-kitchen-set";
            else if (sLower.includes("estacionamiento") || sLower.includes("parqueo")) iconClass = "fa-solid fa-car";
            else if (sLower.includes("playa")) iconClass = "fa-solid fa-umbrella-beach";
            else if (sLower.includes("piscina")) iconClass = "fa-solid fa-water-ladder";
            else if (sLower.includes("vista")) iconClass = "fa-solid fa-mountain-sun";
            else if (sLower.includes("bbq") || sLower.includes("parrilla")) iconClass = "fa-solid fa-fire-burner";
            
            return `<span class="amenity-tag"><i class="${iconClass}"></i> ${service}</span>`;
        }).join("");

        // Generar enlace personalizado de reserva por WhatsApp
        const waMessage = encodeURIComponent(`Hola, deseo obtener información sobre una reserva en ${item.name} en Kakun Airbnb.`);
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

        const card = document.createElement("article");
        card.className = "accommodation-card";
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy">
                <span class="card-tag">${item.locationKey === 'cieneguita' ? 'Frente al Mar' : 'Cerca de la Playa'}</span>
                <div class="card-price-badge">$${item.price}<span> / noche</span></div>
            </div>
            <div class="card-content">
                <div class="card-location-capacity">
                    <span><i class="fa-solid fa-location-dot"></i> ${item.location}</span>
                    <span><i class="fa-solid fa-user-group"></i> ${item.capacity} Huéspedes</span>
                </div>
                <h3 class="card-title">${item.name}</h3>
                <div class="card-amenities">
                    ${servicesHtml}
                </div>
                <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary card-booking-btn">
                    <i class="fa-brands fa-whatsapp"></i> Reservar por WhatsApp
                </a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ==========================================================================
// 5. Filtros y Buscador Interactivos
// ==========================================================================
function initFilters() {
    const filterLocation = document.getElementById("filter-location");
    const filterGuests = document.getElementById("filter-guests");
    const filterPrice = document.getElementById("filter-price");
    const priceValue = document.getElementById("price-value");
    
    const guestMinus = document.getElementById("guest-minus");
    const guestPlus = document.getElementById("guest-plus");
    
    const btnClear = document.getElementById("btn-clear-filters");
    const btnResetMsg = document.getElementById("btn-reset-filters-msg");

    // Lógica para el contador de Huéspedes
    guestMinus.addEventListener("click", () => {
        let val = parseInt(filterGuests.value, 10);
        if (val > 1) {
            filterGuests.value = val - 1;
            applyFilters();
        }
    });

    guestPlus.addEventListener("click", () => {
        let val = parseInt(filterGuests.value, 10);
        if (val < 15) {
            filterGuests.value = val + 1;
            applyFilters();
        }
    });

    // Cambios en los inputs de filtro
    filterLocation.addEventListener("change", applyFilters);
    
    filterPrice.addEventListener("input", (e) => {
        priceValue.textContent = `$${e.target.value}/noche`;
        applyFilters();
    });

    // Función principal de filtrado
    function applyFilters() {
        const locationVal = filterLocation.value;
        const guestsVal = parseInt(filterGuests.value, 10);
        const priceVal = parseInt(filterPrice.value, 10);

        const filtered = ACCOMMODATIONS.filter(item => {
            // Validar ubicación
            const matchLocation = (locationVal === "all" || item.locationKey === locationVal);
            // Validar huéspedes (capacidad del alojamiento debe ser mayor o igual a los solicitados)
            const matchGuests = (item.capacity >= guestsVal);
            // Validar precio (precio de la noche debe ser menor o igual al precio máximo del slider)
            const matchPrice = (item.price <= priceVal);

            return matchLocation && matchGuests && matchPrice;
        });

        renderAccommodations(filtered);
    }

    // Resetear filtros
    const clearAllFilters = () => {
        filterLocation.value = "all";
        filterGuests.value = 1;
        filterPrice.value = 150;
        priceValue.textContent = "$150/noche";
        renderAccommodations(ACCOMMODATIONS);
    };

    btnClear.addEventListener("click", clearAllFilters);
    btnResetMsg.addEventListener("click", clearAllFilters);
}

// ==========================================================================
// 6. Mapa Interactivo (Leaflet.js)
// ==========================================================================
let mapInstance = null;

function initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    // Coordenadas iniciales (Centro entre Puerto Cortés y Cieneguita)
    const initialCoords = [15.805, -87.955];
    const initialZoom = 12;

    // Inicializar mapa de Leaflet
    mapInstance = L.map("map", {
        scrollWheelZoom: false // Evitar zoom accidental al hacer scroll
    }).setView(initialCoords, initialZoom);

    // Habilitar/Deshabilitar scroll de mapa al hacer clic
    mapInstance.on("focus", () => mapInstance.scrollWheelZoom.enable());
    mapInstance.on("blur", () => mapInstance.scrollWheelZoom.disable());

    // Tile Layer: CartoDB Positron (Limpio, estético y estilo moderno similar a Airbnb)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mapInstance);

    // 6.1 Marcadores de Alojamientos
    ACCOMMODATIONS.forEach(acc => {
        // Icono Personalizado color Turquesa para Alojamientos
        const accommodationIcon = L.divIcon({
            html: `<div style="
                background-color: #00a699; 
                width: 38px; 
                height: 38px; 
                border-radius: 50%; 
                border: 3px solid white; 
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                font-weight: bold;
                "><i class="fa-solid fa-house-chimney"></i></div>`,
            className: "custom-acc-marker",
            iconSize: [38, 38],
            iconAnchor: [19, 19]
        });

        // Crear popup estilo Airbnb
        const waMessage = encodeURIComponent(`Hola, deseo obtener información sobre una reserva en ${acc.name} en Kakun Airbnb.`);
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;
        
        const popupHtml = `
            <div class="map-popup-card">
                <div class="popup-img-wrapper">
                    <img src="${acc.image}" alt="${acc.name}" class="popup-img">
                    <span class="popup-price">$${acc.price} / noche</span>
                </div>
                <div class="popup-content">
                    <div class="popup-location-capacity">
                        <i class="fa-solid fa-user-group"></i> Máx. ${acc.capacity} huéspedes
                    </div>
                    <h4 class="popup-title">${acc.name}</h4>
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="popup-btn">
                        <i class="fa-brands fa-whatsapp"></i> Reservar por WhatsApp
                    </a>
                </div>
            </div>
        `;

        // Agregar marcador al mapa
        L.marker(acc.coords, { icon: accommodationIcon })
            .addTo(mapInstance)
            .bindPopup(popupHtml, {
                maxWidth: 260,
                minWidth: 260
            });
    });

    // 6.2 Marcadores de Puntos de Interés / Atracciones
    ATTRACTIONS.forEach(att => {
        // Icono Coral/Naranja para Puntos Turísticos
        const attractionIcon = L.divIcon({
            html: `<div style="
                background-color: #ff5a5f; 
                width: 32px; 
                height: 32px; 
                border-radius: 50%; 
                border: 2.5px solid white; 
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                "><i class="fa-solid fa-umbrella-beach"></i></div>`,
            className: "custom-att-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const popupHtml = `
            <div style="padding: 12px 14px; font-family: 'Plus Jakarta Sans', sans-serif;">
                <h4 style="margin: 0 0 6px 0; font-size: 0.95rem; font-weight: 700; color: #222;">${att.name}</h4>
                <p style="margin: 0 0 10px 0; font-size: 0.8rem; color: #717171; line-height: 1.4;">${att.desc}</p>
                <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20deseo%20obtener%20informaci%C3%B3n%20sobre%20las%20atracciones%20cerca%20de%20${encodeURIComponent(att.name)}%20en%20Kakun%20Airbnb." 
                   target="_blank" rel="noopener" 
                   style="
                   display: inline-flex; 
                   align-items: center; 
                   gap: 4px; 
                   color: #ff5a5f; 
                   font-size: 0.75rem; 
                   font-weight: bold; 
                   text-decoration: none;
                   ">
                   <i class="fa-brands fa-whatsapp"></i> Preguntar por WhatsApp
                </a>
            </div>
        `;

        L.marker(att.coords, { icon: attractionIcon })
            .addTo(mapInstance)
            .bindPopup(popupHtml, {
                maxWidth: 220
            });
    });
}

// ==========================================================================
// 7. Galería de Fotos y Lightbox Modal
// ==========================================================================
function initGallery() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("lightbox-close-btn");
    const prevBtn = document.getElementById("lightbox-prev-btn");
    const nextBtn = document.getElementById("lightbox-next-btn");
    
    let currentIndex = 0;
    const imagesData = [];

    // Recopilar la información de las imágenes de la galería
    galleryItems.forEach((item, index) => {
        const img = item.querySelector("img");
        const title = item.querySelector(".gallery-title").textContent;
        const tag = item.querySelector(".gallery-tag").textContent;
        
        imagesData.push({
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            caption: `${tag} - ${title}`
        });

        // Evento clic para abrir Lightbox
        item.addEventListener("click", () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        updateLightboxContent();
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // Detener scroll de fondo
        
        // Agregar listeners de teclado
        document.addEventListener("keydown", handleKeyDown);
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
        
        // Remover listeners de teclado
        document.removeEventListener("keydown", handleKeyDown);
    }

    function updateLightboxContent() {
        const data = imagesData[currentIndex];
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxCaption.textContent = data.caption;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imagesData.length;
        updateLightboxContent();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imagesData.length) % imagesData.length;
        updateLightboxContent();
    }

    function handleKeyDown(e) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
    }

    // Eventos
    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    // Cerrar al hacer clic en el fondo oscuro
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}
