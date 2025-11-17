document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let chart = null;
    let userProfile = null;
    let objetivoSeleccionado = null;
    
    // Inicializar componentes
    initTabs();
    initObjetivoCards();
    initCalculadora();
    initEjercicios();
    initPerfilForm();
    initPlanTabs();
    initModal();
    initFormularioDatos();
});

// Inicializar pestañas
function initTabs() {
    // Pestañas de rutinas
    const rutinaTabs = document.querySelectorAll('.rutinas-tabs .tab-btn');
    rutinaTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // Remover clase activa de todos los botones
            rutinaTabs.forEach(t => t.classList.remove('active'));
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.rutina-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar el contenido correspondiente
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Pestañas de comidas (similar a las de rutinas)
    const comidaTabs = document.querySelectorAll('.comidas-tabs .tab-btn');
    comidaTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            comidaTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Aquí puedes agregar la lógica para mostrar/ocultar el contenido de las comidas
            console.log('Mostrar contenido de:', targetId);
        });
    });
}

// Inicializar tarjetas de objetivos
function initObjetivoCards() {
    const objetivoCards = document.querySelectorAll('.objetivo-card');
    
    objetivoCards.forEach(card => {
        const button = card.querySelector('.seleccionar-objetivo');
        
        button.addEventListener('click', function() {
            objetivoSeleccionado = this.getAttribute('data-objetivo');
            abrirModal(objetivoSeleccionado);
        });
    });
}

// Inicializar funcionalidad del modal
function initModal() {
    const modal = document.getElementById('planModal');
    const closeModal = document.getElementById('closeModal');
    const comenzarBtn = document.getElementById('comenzarRutina');
    
    // Abrir modal al hacer clic en "Comenzar mi rutina personalizada"
    if (comenzarBtn) {
        comenzarBtn.addEventListener('click', () => abrirModal('tonificar'));
    }
    
    // Cerrar modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// Abrir modal con el objetivo seleccionado
function abrirModal(objetivo) {
    const modal = document.getElementById('planModal');
    const modalTitle = document.getElementById('modalTitle');
    
    // Actualizar título según el objetivo
    const titulos = {
        'bajar-peso': 'Plan para Bajar de Peso',
        'aumentar-masa': 'Plan para Aumentar Masa Muscular',
        'tonificar': 'Plan para Tonificar'
    };
    
    modalTitle.textContent = titulos[objetivo] || 'Tu Plan Personalizado';
    
    // Mostrar formulario y ocultar resultados
    document.getElementById('formularioDatos').classList.remove('hidden');
    document.getElementById('resultadosPlan').classList.add('hidden');
    
    // Mostrar modal
    modal.classList.remove('hidden');
}

// Inicializar formulario de datos personales
function initFormularioDatos() {
    const form = document.getElementById('datosPersonalesForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const datos = {
            nombre: document.getElementById('nombre').value,
            altura: parseFloat(document.getElementById('altura').value),
            pesoActual: parseFloat(document.getElementById('peso-actual').value),
            pesoObjetivo: parseFloat(document.getElementById('peso-objetivo').value),
            nivel: document.getElementById('nivel').value,
            objetivo: objetivoSeleccionado
        };
        
        // Validar datos
        if (!datos.altura || !datos.pesoActual || !datos.pesoObjetivo || !datos.nivel) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        // Generar plan personalizado
        generarPlanPersonalizado(datos);
    });
}

// Generar plan personalizado basado en los datos del usuario
function generarPlanPersonalizado(datos) {
    // Calcular IMC
    const alturaMetros = datos.altura / 100;
    const imc = datos.pesoActual / (alturaMetros * alturaMetros);
    
    // Calcular diferencia de peso
    const diferenciaPeso = Math.abs(datos.pesoActual - datos.pesoObjetivo);
    
    // Calcular semanas estimadas (0.5-1kg por semana es saludable)
    let semanasEstimadas = Math.ceil(diferenciaPeso / 0.7);
    semanasEstimadas = Math.max(4, Math.min(semanasEstimadas, 24)); // Entre 4 y 24 semanas
    
    // Generar gráfico de progreso
    generarGraficoProgreso(datos.pesoActual, datos.pesoObjetivo, semanasEstimadas);
    
    // Actualizar tiempo estimado
    document.getElementById('tiempoEstimado').textContent = 
        `Tiempo estimado para alcanzar tu objetivo: ${semanasEstimadas} semanas`;
    
    // Generar rutina de ejercicios
    const rutina = generarRutinaEjercicios(datos);
    const rutinaContainer = document.getElementById('rutinaEjercicios');
    rutinaContainer.innerHTML = rutina.map(ejercicio => `
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex items-start">
                <div class="bg-pink-100 p-2 rounded-lg mr-4">
                    <i class="${ejercicio.icono} text-pink-500"></i>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-800">${ejercicio.nombre}</h4>
                    <p class="text-sm text-gray-600">${ejercicio.descripcion}</p>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                        <i class="fas fa-redo-alt mr-1"></i>
                        <span>${ejercicio.repeticiones}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Generar plan de alimentación
    const planAlimentacion = generarPlanAlimentacion(datos);
    const alimentacionContainer = document.getElementById('planAlimentacion');
    alimentacionContainer.innerHTML = '';
    
    for (const [comida, detalles] of Object.entries(planAlimentacion)) {
        const comidaElement = document.createElement('div');
        comidaElement.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-100';
        comidaElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-gray-800">${comida}</h4>
                <span class="text-sm px-2 py-1 bg-pink-100 text-pink-700 rounded-full">${detalles.calorias} cal</span>
            </div>
            <p class="text-sm text-gray-600">${detalles.descripcion}</p>
        `;
        alimentacionContainer.appendChild(comidaElement);
    }
    
    // Calcular y mostrar agua recomendada
    const aguaRecomendada = Math.round((datos.pesoActual * 0.035) * 10) / 10; // 35ml por kg de peso
    document.getElementById('aguaRecomendada').textContent = `${aguaRecomendada}L`;
    
    // Mostrar resultados y ocultar formulario
    document.getElementById('formularioDatos').classList.add('hidden');
    document.getElementById('resultadosPlan').classList.remove('hidden');
}

// Generar rutina de ejercicios basada en el objetivo y nivel
function generarRutinaEjercicios(datos) {
    const rutinas = {
        'bajar-peso': {
            principiante: [
                { nombre: 'Cardio ligero', descripcion: 'Caminata rápida o trote suave', repeticiones: '30-40 min', icono: 'fas fa-walking' },
                { nombre: 'Sentadillas', descripcion: '3 series de 12-15 repeticiones', repeticiones: '3x12-15', icono: 'fas fa-dumbbell' },
                { nombre: 'Plancha', descripcion: 'Mantén la posición durante 20-30 segundos', repeticiones: '3 series', icono: 'fas fa-stopwatch' }
            ],
            intermedio: [
                { nombre: 'HIIT', descripcion: '20 minutos de entrenamiento por intervalos', repeticiones: '20 min', icono: 'fas fa-bolt' },
                { nombre: 'Estocadas', descripcion: '3 series de 10 repeticiones por pierna', repeticiones: '3x10 c/pierna', icono: 'fas fa-shoe-prints' },
                { nombre: 'Burpees', descripcion: '3 series de 10-12 repeticiones', repeticiones: '3x10-12', icono: 'fas fa-fire' }
            ],
            avanzado: [
                { nombre: 'Cardio intenso', descripcion: 'Correr, bicicleta o natación', repeticiones: '45-60 min', icono: 'fas fa-running' },
                { nombre: 'Circuito de fuerza', descripcion: '4 ejercicios, 3 rondas', repeticiones: '3 rondas', icono: 'fas fa-sync-alt' },
                { nombre: 'Saltos de tijera', descripcion: '4 series de 30 segundos', repeticiones: '4x30s', icono: 'fas fa-arrows-alt-v' }
            ]
        },
        'aumentar-masa': {
            principiante: [
                { nombre: 'Sentadillas con peso', descripcion: '3 series de 8-10 repeticiones', repeticiones: '3x8-10', icono: 'fas fa-dumbbell' },
                { nombre: 'Flexiones de brazos', descripcion: '3 series al fallo', repeticiones: '3 series', icono: 'fas fa-hand-paper' },
                { nombre: 'Dominadas asistidas', descripcion: '3 series de 6-8 repeticiones', repeticiones: '3x6-8', icono: 'fas fa-arrow-up' }
            ],
            intermedio: [
                { nombre: 'Peso muerto', descripcion: '4 series de 6-8 repeticiones', repeticiones: '4x6-8', icono: 'fas fa-dumbbell' },
                { nombre: 'Press de banca', descripcion: '4 series de 6-8 repeticiones', repeticiones: '4x6-8', icono: 'fas fa-dumbbell' },
                { nombre: 'Remo con barra', descripcion: '3 series de 8-10 repeticiones', repeticiones: '3x8-10', icono: 'fas fa-dumbbell' }
            ],
            avanzado: [
                { nombre: 'Sentadilla trasera', descripcion: '4-5 series de 5-6 repeticiones', repeticiones: '4-5x5-6', icono: 'fas fa-dumbbell' },
                { nombre: 'Press militar', descripcion: '4 series de 6-8 repeticiones', repeticiones: '4x6-8', icono: 'fas fa-dumbbell' },
                { nombre: 'Peso muerto rumano', descripcion: '4 series de 6-8 repeticiones', repeticiones: '4x6-8', icono: 'fas fa-dumbbell' }
            ]
        },
        'tonificar': {
            principiante: [
                { nombre: 'Sentadillas', descripcion: '3 series de 12-15 repeticiones', repeticiones: '3x12-15', icono: 'fas fa-shoe-prints' },
                { nombre: 'Plancha', descripcion: '3 series de 20-30 segundos', repeticiones: '3x20-30s', icono: 'fas fa-stopwatch' },
                { nombre: 'Puente de glúteos', descripcion: '3 series de 12-15 repeticiones', repeticiones: '3x12-15', icono: 'fas fa-arrow-up' }
            ],
            intermedio: [
                { nombre: 'Sentadillas sumo', descripcion: '3 series de 12 repeticiones', repeticiones: '3x12', icono: 'fas fa-shoe-prints' },
                { nombre: 'Plancha lateral', descripcion: '3 series de 20-30 segundos por lado', repeticiones: '3x20-30s', icono: 'fas fa-stopwatch' },
                { nombre: 'Zancadas', descripcion: '3 series de 10 repeticiones por pierna', repeticiones: '3x10 c/pierna', icono: 'fas fa-walking' }
            ],
            avanzado: [
                { nombre: 'Sentadillas búlgaras', descripcion: '3 series de 10 repeticiones por pierna', repeticiones: '3x10 c/pierna', icono: 'fas fa-shoe-prints' },
                { nombre: 'Plancha con elevación de pierna', descripcion: '3 series de 10 repeticiones por pierna', repeticiones: '3x10 c/pierna', icono: 'fas fa-stopwatch' },
                { nombre: 'Peso muerto a una pierna', descripcion: '3 series de 8-10 repeticiones por pierna', repeticiones: '3x8-10 c/p', icono: 'fas fa-arrow-up' }
            ]
        }
    };
    
    return rutinas[datos.objetivo]?.[datos.nivel] || [];
}

// Generar plan de alimentación basado en el objetivo
function generarPlanAlimentacion(datos) {
    const planes = {
        'bajar-peso': {
            'Desayuno': {
                descripcion: 'Tortilla de claras con espinacas y aguacate + 1 rebanada de pan integral',
                calorias: 320
            },
            'Media Mañana': {
                descripcion: '1 manzana + 10 almendras crudas',
                calorias: 150
            },
            'Almuerzo': {
                descripcion: 'Pechuga a la plancha con ensalada de quinoa y vegetales',
                calorias: 400
            },
            'Merienda': {
                descripcion: 'Yogur griego descremado con semillas de chía',
                calorias: 120
            },
            'Cena': {
                descripcion: 'Salmón al horno con espárragos y puré de coliflor',
                calorias: 380
            }
        },
        'aumentar-masa': {
            'Desayuno': {
                descripcion: 'Avena con leche, plátano, mantequilla de maní y proteína en polvo',
                calorias: 600
            },
            'Media Mañana': {
                descripcion: 'Batido de proteína con leche, plátano y mantequilla de maní',
                calorias: 400
            },
            'Almuerzo': {
                descripcion: 'Arroz integral, pechuga de pollo, aguacate y vegetales al vapor',
                calorias: 700
            },
            'Merienda': {
                descripcion: 'Sándwich de pan integral con atún y huevo duro',
                calorias: 350
            },
            'Cena': {
                descripcion: 'Carne magra, boniato asado y brócoli al vapor',
                calorias: 550
            },
            'Antes de dormir': {
                descripcion: 'Caseína con leche y nueces',
                calorias: 300
            }
        },
        'tonificar': {
            'Desayuno': {
                descripcion: 'Tortilla de claras con espinacas, aguacate y tostada integral',
                calorias: 350
            },
            'Media Mañana': {
                descripcion: 'Batido verde con espinaca, plátano y proteína en polvo',
                calorias: 250
            },
            'Almuerzo': {
                descripcion: 'Salmón a la plancha con quinoa y ensalada de vegetales',
                calorias: 500
            },
            'Merienda': {
                descripcion: 'Yogur griego con frutos rojos y semillas de chía',
                calorias: 200
            },
            'Cena': {
                descripcion: 'Pechuga de pavo con espárragos y puré de coliflor',
                calorias: 400
            }
        }
    };
    
    return planes[datos.objetivo] || {};
}

// Inicializar calculadora
function initCalculadora() {
    const form = document.getElementById('fitness-form');
    const resultados = document.getElementById('resultados');
    const sinResultados = document.getElementById('sin-resultados');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const altura = parseFloat(document.getElementById('altura').value) / 100; // Convertir a metros
        const peso = parseFloat(document.getElementById('peso').value);
        const objetivo = document.getElementById('objetivo').value;
        
        if (!altura || !peso || !objetivo) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Calcular IMC
        const imc = calcularIMC(peso, altura);
        
        // Determinar peso objetivo según el objetivo seleccionado
        let pesoObjetivo, tiempoSemanas, descripcionObjetivo;
        
        switch(objetivo) {
            case 'perder-peso':
                // Objetivo: Perder 0.5-1 kg por semana (5-10% del peso actual)
                const perdidaPorcentaje = 0.07; // 7% del peso actual
                pesoObjetivo = peso * (1 - perdidaPorcentaje);
                tiempoSemanas = 12; // 12 semanas
                descripcionObjetivo = 'Pérdida de peso saludable';
                break;
                
            case 'aumentar-masa':
                // Objetivo: Ganar 0.2-0.5 kg por semana (5-10% del peso actual)
                const aumentoPorcentaje = 0.07; // 7% del peso actual
                pesoObjetivo = peso * (1 + aumentoPorcentaje);
                tiempoSemanas = 16; // 16 semanas
                descripcionObjetivo = 'Aumento de masa muscular';
                break;
                
            case 'tonificar':
                // Objetivo: Mantener peso o pequeña reducción (0-5%)
                pesoObjetivo = peso * 0.97; // 3% menos para definición
                tiempoSemanas = 10; // 10 semanas
                descripcionObjetivo = 'Tonificación y definición';
                break;
        }
        
        // Mostrar resultados
        document.getElementById('imc').textContent = imc.toFixed(1) + ' (' + getNivelIMC(imc) + ')';
        document.getElementById('peso-objetivo').textContent = `${pesoObjetivo.toFixed(1)} kg (${descripcionObjetivo})`;
        document.getElementById('tiempo-estimado').textContent = `${tiempoSemanas} semanas`;
        
        // Mostrar resultados y ocultar mensaje de "sin resultados"
        resultados.classList.remove('hidden');
        sinResultados.classList.add('hidden');
        
        // Generar gráfico de progreso
        generarGraficoProgreso(peso, pesoObjetivo, tiempoSemanas);
        
        // Actualizar perfil del usuario si existe
        if (userProfile) {
            userProfile.peso = peso;
            userProfile.altura = altura * 100; // Convertir a cm
            userProfile.objetivo = objetivo;
            userProfile.pesoObjetivo = pesoObjetivo;
            userProfile.tiempoObjetivo = tiempoSemanas;
        }
    });
}

// Generar gráfico de progreso con Chart.js
function generarGraficoProgreso(pesoInicial, pesoObjetivo, semanas) {
    const ctx = document.getElementById('grafico-progreso').getContext('2d');
    
    // Calcular progreso semanal
    const diferencia = pesoObjetivo - pesoInicial;
    const cambioSemanal = diferencia / semanas;
    
    // Generar datos para el gráfico
    const semanasData = [];
    const pesoData = [];
    
    for (let i = 0; i <= semanas; i++) {
        semanasData.push(`Semana ${i}`);
        pesoData.push(pesoInicial + (cambioSemanal * i));
    }
    
    // Destruir gráfico anterior si existe
    if (chart) {
        chart.destroy();
    }
    
    // Crear nuevo gráfico
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: semanasData,
            datasets: [{
                label: 'Peso (kg)',
                data: pesoData,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Peso: ${context.parsed.y.toFixed(1)} kg`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return value + ' kg';
                        }
                    }
                }
            }
        }
    });
}

// Funciones de cálculo de salud
function calcularIMC(peso, altura) {
    return peso / (altura * altura);
}

function calcularTMB(peso, altura, edad, genero) {
    // Fórmula de Harris-Benedict
    if (genero === 'femenino') {
        return 655.1 + (9.563 * peso) + (1.85 * altura * 100) - (4.676 * edad);
    } else {
        return 66.47 + (13.75 * peso) + (5.003 * altura * 100) - (6.755 * edad);
    }
}

function calcularCaloriasDiarias(tmb, nivelActividad) {
    const factores = {
        'sedentario': 1.2,
        'ligero': 1.375,
        'moderado': 1.55,
        'activo': 1.725,
        'muy-activo': 1.9
    };
    return tmb * (factores[nivelActividad] || 1.2);
}

function calcularAguaRecomendada(peso, genero) {
    // 35ml por kg de peso para mujeres, 40ml para hombres
    const factorAgua = genero === 'femenino' ? 35 : 40;
    return (peso * factorAgua) / 1000; // Convertir a litros
}

// Obtener nivel de IMC
function getNivelIMC(imc) {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
}

// Inicializar funcionalidad de ejercicios
function initEjercicios() {
    // Agregar evento de clic a los botones "Ver detalle"
    document.querySelectorAll('.ver-detalle').forEach(btn => {
        btn.addEventListener('click', function() {
            const ejercicio = this.getAttribute('data-ejercicio');
            // Aquí podrías mostrar un modal con más detalles del ejercicio
            console.log('Mostrar detalles del ejercicio:', ejercicio);
        });
    });
    
    // Aquí podrías cargar dinámicamente los ejercicios desde una API o archivo JSON
    // Por ahora, usaremos datos estáticos
    const ejercicios = {
        'perder-peso': [
            {
                nombre: 'Cardio (Correr/Caminar)',
                series: '30-45 min',
                calorias: '200-400',
                descripcion: 'Ejercicio cardiovascular de intensidad moderada a alta para quemar calorías.'
            },
            // Más ejercicios...
        ],
        'aumentar-masa': [
            // Ejercicios para aumentar masa...
        ],
        'tonificar': [
            // Ejercicios para tonificar...
        ]
    };
}

// Función para formatear números
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Inicializar formulario de perfil
function initPerfilForm() {
    const perfilForm = document.getElementById('perfil-form');
    if (!perfilForm) return;
    
    perfilForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const genero = document.getElementById('genero').value;
        const edad = parseInt(document.getElementById('edad').value);
        const altura = parseFloat(document.getElementById('altura').value);
        const peso = parseFloat(document.getElementById('peso').value);
        const nivelActividad = document.getElementById('nivel-actividad').value;
        
        // Validar datos
        if (!genero || isNaN(edad) || isNaN(altura) || isNaN(peso) || !nivelActividad) {
            alert('Por favor completa todos los campos correctamente.');
            return;
        }
        
        // Calcular métricas de salud
        const imc = calcularIMC(peso, altura);
        const tmb = calcularTMB(peso, altura, edad, genero);
        const caloriasDiarias = calcularCaloriasDiarias(tmb, nivelActividad);
        const aguaRecomendada = calcularAguaRecomendada(peso, genero);
        
        // Actualizar la interfaz de usuario
        actualizarResultadosPerfil({
            imc: imc,
            nivelIMC: getNivelIMC(imc),
            tmb: Math.round(tmb),
            caloriasDiarias: Math.round(caloriasDiarias),
            aguaRecomendada: aguaRecomendada.toFixed(1)
        });
        
        // Guardar perfil del usuario
        userProfile = {
            genero,
            edad,
            altura,
            peso,
            nivelActividad,
            imc,
            tmb,
            caloriasDiarias,
            aguaRecomendada,
            fechaRegistro: new Date().toISOString()
        };
        
        // Mostrar sección de plan personalizado
        document.querySelector('.plan-section').classList.remove('hidden');
        
        // Desplazarse a la sección de plan personalizado
        document.querySelector('.plan-section').scrollIntoView({ behavior: 'smooth' });
        
        // Generar plan personalizado basado en el objetivo seleccionado
        const objetivoSeleccionado = document.querySelector('.objetivo-card.destacado')?.getAttribute('data-objetivo');
        if (objetivoSeleccionado) {
            generarPlanPersonalizado(objetivoSeleccionado, userProfile);
        }
    });
}

// Inicializar pestañas del plan personalizado
function initPlanTabs() {
    const tabButtons = document.querySelectorAll('.plan-tabs .tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // Remover clase activa de todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.plan-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar el contenido correspondiente
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Actualizar resultados del perfil en la interfaz
function actualizarResultadosPerfil(datos) {
    document.getElementById('imc-perfil').textContent = datos.imc.toFixed(1);
    
    const nivelIMCElement = document.getElementById('nivel-imc');
    nivelIMCElement.textContent = datos.nivelIMC;
    
    // Estilizar según el nivel de IMC
    nivelIMCElement.className = 'resultado-nivel ';
    if (datos.imc < 18.5) {
        nivelIMCElement.classList.add('bajo-peso');
    } else if (datos.imc < 25) {
        nivelIMCElement.classList.add('normal');
    } else if (datos.imc < 30) {
        nivelIMCElement.classList.add('sobrepeso');
    } else {
        nivelIMCElement.classList.add('obesidad');
    }
    
    document.getElementById('tmb').textContent = formatNumber(datos.tmb);
    document.getElementById('calorias-dia').textContent = formatNumber(datos.caloriasDiarias);
    document.getElementById('agua').textContent = datos.aguaRecomendada;
    
    // Mostrar resultados y ocultar mensaje de "sin datos"
    document.getElementById('resultados-perfil').classList.remove('hidden');
    document.getElementById('sin-datos-perfil').style.display = 'none';
}

// Generar plan personalizado basado en el objetivo
function generarPlanPersonalizado(objetivo, perfil) {
    // Obtener datos del plan según el objetivo
    const plan = obtenerPlanPorObjetivo(objetivo, perfil);
    
    // Actualizar la sección de rutina
    actualizarRutinaPersonalizada(plan.rutina);
    
    // Actualizar la sección de alimentación
    actualizarAlimentacionPersonalizada(plan.alimentacion);
    
    // Actualizar la sección de seguimiento
    actualizarSeguimientoPersonalizado(plan.seguimiento);
}

// Actualizar la sección de rutina personalizada
function actualizarRutinaPersonalizada(rutina) {
    const rutinaContainer = document.querySelector('.rutina-personalizada');
    if (!rutinaContainer) return;
    
    let html = `
        <div class="rutina-info">
            <h4>${rutina.titulo}</h4>
            <p>${rutina.descripcion}</p>
            <div class="rutina-estadisticas">
                <div class="estadistica">
                    <i class="fas fa-fire"></i>
                    <span>Quema aprox: <strong>${rutina.caloriasQuemadas} kcal/sesión</strong></span>
                </div>
                <div class="estadistica">
                    <i class="fas fa-dumbbell"></i>
                    <span>Dificultad: <strong>${rutina.dificultad}</strong></span>
                </div>
                <div class="estadistica">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Días/semana: <strong>${rutina.diasPorSemana}</strong></span>
                </div>
            </div>
        </div>
        <div class="rutina-semanas">
            <h4>Plan de ${rutina.duracionSemanas} semanas</h4>
    `;
    
    // Agregar semanas de entrenamiento
    rutina.semanas.forEach((semana, index) => {
        html += `
            <div class="semana">
                <h5>Semana ${index + 1}</h5>
                <ul class="dias-rutina">
                    ${semana.dias.map(dia => `
                        <li>
                            <strong>${dia.dia}:</strong> ${dia.actividad}
                            ${dia.detalles ? `<div class="detalles-ejercicio">${dia.detalles}</div>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    });
    
    html += `</div>`;
    rutinaContainer.innerHTML = html;
}

// Actualizar la sección de alimentación personalizada
function actualizarAlimentacionPersonalizada(alimentacion) {
    const alimentacionContainer = document.querySelector('.alimentacion-personalizada');
    if (!alimentacionContainer) return;
    
    let html = `
        <div class="resumen-nutricional">
            <h4>Resumen Nutricional Diario</h4>
            <div class="nutrientes-grid">
                <div class="nutriente">
                    <div class="nutriente-valor">${alimentacion.caloriasDiarias} <span>kcal</span></div>
                    <div class="nutriente-etiqueta">Calorías</div>
                </div>
                <div class="nutriente">
                    <div class="nutriente-valor">${alimentacion.macros.proteinas}g <span>proteínas</span></div>
                    <div class="nutriente-etiqueta">${Math.round((alimentacion.macros.proteinas * 4 / alimentacion.caloriasDiarias) * 100)}%</div>
                </div>
                <div class="nutriente">
                    <div class="nutriente-valor">${alimentacion.macros.carbohidratos}g <span>carbohidratos</span></div>
                    <div class="nutriente-etiqueta">${Math.round((alimentacion.macros.carbohidratos * 4 / alimentacion.caloriasDiarias) * 100)}%</div>
                </div>
                <div class="nutriente">
                    <div class="nutriente-valor">${alimentacion.macros.grasas}g <span>grasas</span></div>
                    <div class="nutriente-etiqueta">${Math.round((alimentacion.macros.grasas * 9 / alimentacion.caloriasDiarias) * 100)}%</div>
                </div>
            </div>
        </div>
        
        <div class="plan-comidas">
            <h4>Plan de Comidas Diario</h4>
    `;
    
    // Agregar comidas del día
    alimentacion.comidasDiarias.forEach(comida => {
        html += `
            <div class="comida">
                <div class="comida-header">
                    <h5>${comida.nombre} <span>${comida.hora}</span></h5>
                    <span class="calorias-comida">${comida.calorias} kcal</span>
                </div>
                <ul class="alimentos">
                    ${comida.alimentos.map(alimento => `
                        <li>${alimento.cantidad} ${alimento.nombre} <span>${alimento.calorias} kcal</span></li>
                    `).join('')}
                </ul>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="recomendaciones">
            <h4>Recomendaciones</h4>
            <ul class="lista-recomendaciones">
                ${alimentacion.recomendaciones.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
    
    alimentacionContainer.innerHTML = html;
}

// Actualizar la sección de seguimiento personalizado
function actualizarSeguimientoPersonalizado(seguimiento) {
    // Actualizar gráfico de progreso
    const ctx = document.getElementById('grafico-progreso-personalizado').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    
    // Crear nuevo gráfico
    window.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: seguimiento.semanas.map((_, i) => `Semana ${i + 1}`),
            datasets: [{
                label: 'Peso (kg)',
                data: seguimiento.pesos,
                borderColor: 'rgba(242, 131, 175, 1)',
                backgroundColor: 'rgba(242, 131, 175, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Peso: ${context.parsed.y.toFixed(1)} kg`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return value + ' kg';
                        }
                    }
                }
            }
        }
    });
    
    // Actualizar lista de metas
    const metasContainer = document.querySelector('.lista-metas');
    if (metasContainer) {
        metasContainer.innerHTML = seguimiento.metas
            .map(meta => `<li>${meta}</li>`)
            .join('');
    }
}

// Obtener plan según el objetivo y perfil del usuario
function obtenerPlanPorObjetivo(objetivo, perfil) {
    // Datos de ejemplo - en una aplicación real, esto vendría de una API o base de datos
    const planes = {
        'perder-peso': {
            rutina: {
                titulo: 'Rutina de Pérdida de Peso',
                descripcion: 'Combinación de ejercicios cardiovasculares y de fuerza para maximizar la quema de grasa.',
                caloriasQuemadas: '350-500',
                dificultad: 'Intermedia',
                diasPorSemana: 5,
                duracionSemanas: 12,
                semanas: Array(12).fill().map((_, semana) => ({
                    dias: [
                        { dia: 'Lunes', actividad: 'Cardio (30 min) + Fuerza superior', detalles: 'Ejercicios con pesas para brazos, pecho y espalda' },
                        { dia: 'Martes', actividad: 'Cardio HIIT (20 min)' },
                        { dia: 'Miércoles', actividad: 'Descanso activo', detalles: 'Caminata ligera o yoga' },
                        { dia: 'Jueves', actividad: 'Cardio (30 min) + Fuerza inferior', detalles: 'Sentadillas, zancadas y ejercicios de piernas' },
                        { dia: 'Viernes', actividad: 'Cardio en intervalos (25 min)' },
                        { dia: 'Sábado', actividad: 'Entrenamiento completo', detalles: 'Circuito de cuerpo completo' },
                        { dia: 'Domingo', actividad: 'Descanso' }
                    ]
                }))
            },
            alimentacion: {
                caloriasDiarias: Math.round(perfil.caloriasDiarias * 0.8), // 20% de déficit
                macros: {
                    proteinas: Math.round(perfil.peso * 2.2), // 2.2g por kg de peso
                    carbohidratos: Math.round((perfil.caloriasDiarias * 0.4) / 4), // 40% de calorías
                    grasas: Math.round((perfil.caloriasDiarias * 0.25) / 9) // 25% de calorías
                },
                comidasDiarias: [
                    {
                        nombre: 'Desayuno',
                        hora: '7:00 AM',
                        calorias: Math.round(perfil.caloriasDiarias * 0.2),
                        alimentos: [
                            { nombre: 'Avena', cantidad: '1/2 taza', calorias: 150 },
                            { nombre: 'Claras de huevo', cantidad: '3 unidades', calorias: 51 },
                            { nombre: 'Plátano', cantidad: '1 mediano', calorios: 105 }
                        ]
                    },
                    // Más comidas...
                ],
                recomendaciones: [
                    'Toma al menos 8 vasos de agua al día',
                    'Evita los alimentos procesados y azúcares añadidos',
                    'Realiza 5 comidas al día en porciones controladas',
                    'Incluye proteína en cada comida principal'
                ]
            },
            seguimiento: {
                pesos: Array(13).fill().map((_, i) => {
                    const progreso = (perfil.peso * 0.8) * (i / 12); // Objetivo: 20% de pérdida
                    return perfil.peso - progreso;
                }),
                metas: [
                    `Perder ${Math.round(perfil.peso * 0.2)} kg en 12 semanas`,
                    'Reducir el porcentaje de grasa corporal en un 5-7%',
                    'Aumentar la resistencia cardiovascular',
                    'Mejorar la composición corporal'
                ]
            }
        },
        // Más planes para otros objetivos...
    };
    
    return planes[objetivo] || planes['perder-peso']; // Por defecto devuelve el plan de pérdida de peso
}

// Función para animar números
function animateValue(element, start, end, duration) {
    const range = end - start;
    const minFrameTime = 30; // 30fps
    const totalFrames = Math.ceil(duration / minFrameTime);
    const step = range / totalFrames;
    
    let current = start;
    let frameCount = 0;
    
    const counter = setInterval(() => {
        current += step;
        frameCount++;
        
        if (frameCount >= totalFrames) {
            current = end;
            clearInterval(counter);
        }
        
        element.textContent = Math.round(current);
    }, minFrameTime);
}
