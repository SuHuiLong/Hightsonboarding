import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // General
    'app.name': 'Gateway',
    'skip': 'Skip',
    'continue': 'Continue',
    'retry': 'Retry',
    'done': 'Done',
    'cancel': 'Cancel',
    'yes': 'Yes',
    'no': 'No',
    
    // Login
    'login.title': 'Heights',
    'login.subtitle': 'Choose how you want to connect',
    'login.method.title': 'Select Login Method',
    'login.method.local': 'Login with Local',
    'login.method.local.description': 'Connect directly to your local network',
    'login.method.cloud': 'Login with Cloud',
    'login.method.cloud.description': 'Access remotely through cloud services',
    'login.form.title': 'Login Credentials',
    'login.form.username': 'Username',
    'login.form.email': 'Email Address',
    'login.form.password': 'Password',
    'login.terms.agree': 'I agree to the',
    'login.terms.link': 'Terms & Agreements',
    'login.terms.required': 'You must agree to the terms to continue',
    'login.error.method': 'Please select a login method',
    'login.error.username': 'Please enter your username',
    'login.error.email': 'Please enter your email address',
    'login.error.email.invalid': 'Please enter a valid email address',
    'login.error.password': 'Please enter your password',
    'login.error.password.short': 'Password must be at least 6 characters',
    'login.button': 'Continue',
    'login.footer': 'Secure connection • Privacy protected',
    
    // Welcome
    'welcome.title': 'Welcome to Heights!',
    'welcome.message': "Hi! I'm Janus, your Heights assistant. I'll help you set up your devices. What would you like to set up?",
    'welcome.setup.gateway': 'Set up Gateway',
    'welcome.setup.extender': 'Add Extender',
    
    // Gateway Flow
    'gateway.step1.title': 'Connect Your Gateway',
    'gateway.step1.message': 'Please ensure your Gateway is powered on and the WAN Ethernet cable is connected.',
    'gateway.step1.instruction1': 'Power on your Gateway device',
    'gateway.step1.instruction2': 'Connect WAN Ethernet cable',
    'gateway.step1.instruction3': 'Wait for the LED to turn solid blue',
    'gateway.step1.ready': "I've connected it",
    
    // Gateway Onboarding - Location
    'gateway.location.title': 'Set Location',
    'gateway.location.message': 'Where are you setting up this Gateway?',
    'gateway.location.myhome.suffix': '\'s Home',
    'gateway.location.floor1': '1st Floor',
    'gateway.location.floor2': '2nd Floor',
    'gateway.location.floor3': '3rd Floor',
    'gateway.location.custom': 'Custom Location',
    'gateway.location.custom.placeholder': 'Enter location name',
    'gateway.location.continue': 'Continue',
    
    // Gateway WAN Configuration
    'gateway.wan.title': 'Configure WAN',
    'gateway.wan.message': 'How does your Gateway connect to the internet?',
    'gateway.wan.recommended': 'Recommended',
    'gateway.wan.optional': 'Optional',
    'gateway.wan.dhcp.title': 'DHCP (Automatic)',
    'gateway.wan.dhcp.desc': 'Automatically get IP address from your ISP',
    'gateway.wan.pppoe.title': 'PPPoE',
    'gateway.wan.pppoe.desc': 'Connect using username and password from ISP',
    'gateway.wan.pppoe.config': 'PPPoE Configuration',
    'gateway.wan.pppoe.username': 'Username',
    'gateway.wan.pppoe.username.placeholder': 'Enter PPPoE username',
    'gateway.wan.pppoe.password': 'Password',
    'gateway.wan.pppoe.password.placeholder': 'Enter PPPoE password',
    'gateway.wan.static.title': 'Static IP',
    'gateway.wan.static.desc': 'Manually configure IP address settings',
    'gateway.wan.static.config': 'Static IP Configuration',
    'gateway.wan.static.ip': 'IP Address',
    'gateway.wan.static.subnet': 'Subnet Mask',
    'gateway.wan.static.gateway': 'Default Gateway',
    'gateway.wan.static.dns1': 'Primary DNS',
    'gateway.wan.static.dns2': 'Secondary DNS',
    
    // Gateway Selection for Extender
    'gateway.select.title': 'Select Gateway',
    'gateway.select.message': 'Which Gateway do you want to add the extender to?',
    'gateway.select.nogateways': 'No Gateways found. You need to set up a Gateway first before adding extenders.',
    'gateway.select.required': 'Gateway Required',
    'gateway.select.required.desc': 'Extenders need to connect to an existing Gateway. Please set up your Gateway first.',
    'gateway.select.setup.first': 'Set up your Gateway to get started',
    'gateway.select.add.another': 'Add Another Gateway',
    
    'gateway.step2.title': 'Connecting to Cloud',
    'gateway.step2.message': 'Your Gateway is connecting to the cloud...',
    'gateway.step2.registering': 'Registering device...',
    'gateway.step2.claiming': 'Claiming to location...',
    'gateway.step2.configuring': 'Configuring settings...',
    'gateway.step2.starting': 'Starting onboarding network...',
    
    'gateway.success.title': 'Gateway Online! 🎉',
    'gateway.success.message': 'Your Gateway is now online and ready. The onboarding network is active for adding extenders.',
    'gateway.success.ssid': 'Onboarding SSID',
    'gateway.success.status': 'Status',
    'gateway.success.location': 'Location',
    'gateway.success.add.extender': 'Add Extender',
    'gateway.success.finish': 'Finish Setup',
    
    // Extender Flow
    'extender.step1.title': 'Add Extender',
    'extender.step1.message': 'To add an extender, I\'ll scan for nearby devices via Bluetooth. If your Extender supports Bluetooth, power it on and it will appear in the list below. You can also scan the QR code on your device or enter the serial number manually.',
    'extender.step1.bluetooth.scanning': 'Bluetooth Scan',
    'extender.step1.bluetooth.searching': 'Searching for nearby devices...',
    'extender.step1.bluetooth.none': 'No nearby devices found',
    'extender.step1.bluetooth.rescan': 'Rescan',
    'extender.step1.selected': 'Device selected',
    'extender.step1.or': 'or use another method',
    'extender.step1.scan': 'Scan QR Code',
    'extender.step1.manual': 'Enter Serial Number',
    
    'extender.step2.title': 'Enter Serial Number',
    'extender.step2.message': 'Please enter the serial number found on the back of your extender.',
    'extender.step2.placeholder': 'e.g., EXT-1234-5678-90AB',
    'extender.step2.submit': 'Continue',
    'extender.step2.invalid': 'Please enter a valid serial number',
    
    'extender.step3.title': 'Authorizing Device',
    'extender.step3.message': 'Adding extender to your network...',
    'extender.step3.registering': 'Registering extender...',
    'extender.step3.binding': 'Binding to location...',
    'extender.step3.whitelisting': 'Updating MAC whitelist...',
    'extender.step3.authorized': 'Extender authorized!',
    
    'extender.room.title': 'Set Room Location',
    'extender.room.message': 'In which room will this extender be placed?',
    'extender.room.main.location': 'Main Location',
    'extender.room.living': 'Living Room',
    'extender.room.bedroom': 'Bedroom',
    'extender.room.kitchen': 'Kitchen',
    'extender.room.bathroom': 'Bathroom',
    'extender.room.office': 'Office',
    'extender.room.garage': 'Garage',
    'extender.room.custom': 'Custom Room',
    'extender.room.custom.placeholder': 'Enter room name',
    'extender.room.continue': 'Continue',
    
    'extender.poweron.title': 'Prepare Your Extender',
    'extender.poweron.message': "Let's get started! Please follow these steps to set up your extender.",
    'extender.poweron.instruction1': 'Place the extender in your desired location',
    'extender.poweron.instruction2': 'Connect the power adapter and plug it in',
    'extender.poweron.instruction3': 'Wait for the LED to turn solid (about 30-60 seconds)',
    'extender.poweron.confirm': 'Extender is Ready',
    
    'extender.step4.title': 'Power On Extender',
    'extender.step4.message': 'Your extender is now authorized. Please power it on to complete the setup.',
    'extender.step4.instruction1': 'Place the extender in the desired location',
    'extender.step4.instruction2': 'Power on the extender',
    'extender.step4.instruction3': 'Wait for connection (may take 1-2 minutes)',
    'extender.step4.ready': 'Extender is powered on',
    
    'extender.step5.title': 'Connecting Extender',
    'extender.step5.message': 'The extender is connecting to your network...',
    'extender.step5.scanning': 'Scanning for setup network...',
    'extender.step5.authenticating': 'Authenticating with Gateway...',
    'extender.step5.connecting': 'Connecting to cloud...',
    'extender.step5.finalizing': 'Applying final configuration...',
    
    'extender.success.title': 'Extender Connected! 🎉',
    'extender.success.message': 'Your extender is now online and extending your network coverage.',
    'extender.success.device': 'Device',
    'extender.success.signal': 'Signal to Gateway',
    'extender.success.coverage': 'Coverage Area',
    'extender.success.add.another': 'Add Another Extender',
    'extender.success.finish': 'Finish Setup',
    
    'extender.error.not.whitelisted': 'Connection rejected - unauthorized device',
    'extender.error.no.network': 'Setup network not found',
    'extender.error.timeout': 'Connection timeout - please try again',
    
    // Device Detection (Legacy - kept for compatibility)
    'detect.searching': "Great! I'm scanning for your Wi-Fi router...",
    'detect.found': "Perfect! I found your device:",
    'detect.confirm': "Is this your router?",
    'detect.not.mine': "That's not mine",
    'detect.correct': "Yes, that's it!",
    
    // Setup (Legacy - kept for compatibility)
    'setup.start': 'Awesome! Let me configure your network...',
    'setup.connecting': 'Connecting to your router...',
    'setup.configuring': 'Optimizing settings...',
    'setup.securing': 'Securing your network...',
    'setup.finalizing': 'Finishing up...',
    
    // Success (Legacy - kept for compatibility)
    'success.title': 'All set! 🎉',
    'success.message': 'Your Gateway network is now active and optimized. You can manage your settings anytime from the dashboard.',
    'success.network.name': 'Network Name',
    'success.devices': 'Connected Devices',
    'success.signal': 'Signal Strength',
    'success.go.dashboard': 'Go to Dashboard',
    
    // Error
    'error.title': 'Oops! Something went wrong',
    'error.connection': "I couldn't connect to the router. This could be due to:",
    'error.reason.power': 'Router is not powered on',
    'error.reason.distance': 'Device is too far from router',
    'error.reason.network': 'Network interference',
    'error.solutions': 'What would you like to do?',
    'error.retry.setup': 'Try Again',
    'error.manual.setup': 'Manual Setup',
    'error.contact.support': 'Contact Support',
    
    // Device Info
    'device.model': 'Model',
    'device.signal': 'Signal',
    'device.status': 'Status',
    'device.status.online': 'Online',
    'device.status.offline': 'Offline',
    
    // Accessibility
    'a11y.typing': 'Assistant is typing',
    'a11y.message.assistant': 'Assistant message',
    'a11y.message.user': 'Your message',
    'a11y.theme.toggle': 'Toggle theme',
    'a11y.language.select': 'Select language',
    'a11y.progress': 'Setup progress',
  },
  es: {
    // General
    'app.name': 'Gateway',
    'skip': 'Omitir',
    'continue': 'Continuar',
    'retry': 'Reintentar',
    'done': 'Hecho',
    'cancel': 'Cancelar',
    'yes': 'Sí',
    'no': 'No',
    
    // Login
    'login.title': 'Heights',
    'login.subtitle': 'Elige cómo quieres conectarte',
    'login.method.title': 'Selecciona el método de inicio de sesión',
    'login.method.local': 'Iniciar sesión con Local',
    'login.method.local.description': 'Conéctate directamente a tu red local',
    'login.method.cloud': 'Iniciar sesión con Cloud',
    'login.method.cloud.description': 'Accede de forma remota a través de servicios en la nube',
    'login.form.title': 'Credenciales de inicio de sesión',
    'login.form.username': 'Nombre de usuario',
    'login.form.email': 'Dirección de correo electrónico',
    'login.form.password': 'Contraseña',
    'login.terms.agree': 'Acepto los',
    'login.terms.link': 'Términos y Acuerdos',
    'login.terms.required': 'Debes aceptar los términos para continuar',
    'login.error.method': 'Por favor, selecciona un método de inicio de sesión',
    'login.error.username': 'Por favor, ingresa tu nombre de usuario',
    'login.error.email': 'Por favor, ingresa tu dirección de correo electrónico',
    'login.error.email.invalid': 'Por favor, ingresa una dirección de correo electrónico válida',
    'login.error.password': 'Por favor, ingresa tu contraseña',
    'login.error.password.short': 'La contraseña debe tener al menos 6 caracteres',
    'login.button': 'Continuar',
    'login.footer': 'Conexión segura • Protección de privacidad',
    
    // Welcome
    'welcome.title': 'Bienvenido a Heights!',
    'welcome.message': "¡Hola! Soy Janus, tu asistente de Heights. Te ayudaré a configurar tus dispositivos. ¿Qué te gustaría configurar?",
    'welcome.setup.gateway': 'Configurar Gateway',
    'welcome.setup.extender': 'Agregar Extensor',
    
    // Gateway Flow
    'gateway.step1.title': 'Conecta tu Gateway',
    'gateway.step1.message': 'Asegúrate de que tu Gateway esté encendido y el cable Ethernet WAN esté conectado.',
    'gateway.step1.instruction1': 'Enciende tu dispositivo Gateway',
    'gateway.step1.instruction2': 'Conecta el cable Ethernet WAN',
    'gateway.step1.instruction3': 'Espera a que el LED se ponga azul sólido',
    'gateway.step1.ready': 'Ya lo conecté',
    
    // Gateway Onboarding - Location
    'gateway.location.title': 'Establecer Ubicación',
    'gateway.location.message': '¿Dónde estás configurando este Gateway?',
    'gateway.location.myhome.suffix': '\'s Home',
    'gateway.location.floor1': '1er Piso',
    'gateway.location.floor2': '2do Piso',
    'gateway.location.floor3': '3er Piso',
    'gateway.location.custom': 'Ubicación Personalizada',
    'gateway.location.custom.placeholder': 'Ingresa el nombre de la ubicación',
    'gateway.location.continue': 'Continuar',
    
    // Gateway WAN Configuration
    'gateway.wan.title': 'Configurar WAN',
    'gateway.wan.message': '¿Cómo se conecta tu Gateway a Internet?',
    'gateway.wan.recommended': 'Recomendado',
    'gateway.wan.optional': 'Opcional',
    'gateway.wan.dhcp.title': 'DHCP (Automático)',
    'gateway.wan.dhcp.desc': 'Obtener automáticamente la dirección IP de tu ISP',
    'gateway.wan.pppoe.title': 'PPPoE',
    'gateway.wan.pppoe.desc': 'Conectar usando el nombre de usuario y la contraseña de tu ISP',
    'gateway.wan.pppoe.config': 'Configuración PPPoE',
    'gateway.wan.pppoe.username': 'Nombre de usuario',
    'gateway.wan.pppoe.username.placeholder': 'Ingresa el nombre de usuario PPPoE',
    'gateway.wan.pppoe.password': 'Contraseña',
    'gateway.wan.pppoe.password.placeholder': 'Ingresa la contraseña PPPoE',
    'gateway.wan.static.title': 'IP Estática',
    'gateway.wan.static.desc': 'Configurar manualmente la configuración de la dirección IP',
    'gateway.wan.static.config': 'Configuración IP Estática',
    'gateway.wan.static.ip': 'Dirección IP',
    'gateway.wan.static.subnet': 'Máscara de subred',
    'gateway.wan.static.gateway': 'Puerta de enlace predeterminada',
    'gateway.wan.static.dns1': 'DNS Primario',
    'gateway.wan.static.dns2': 'DNS Secundario',
    
    // Gateway Selection for Extender
    'gateway.select.title': 'Seleccionar Gateway',
    'gateway.select.message': '¿A qué Gateway quieres agregar el extensor?',
    'gateway.select.nogateways': 'No se encontraron Gateways. Necesitas configurar un Gateway primero antes de agregar extensores.',
    'gateway.select.required': 'Gateway Requerido',
    'gateway.select.required.desc': 'Los extensores necesitan conectarse a un Gateway existente. Por favor, configura tu Gateway primero.',
    'gateway.select.setup.first': 'Configura tu Gateway para comenzar',
    'gateway.select.add.another': 'Agregar Otro Gateway',
    
    'gateway.step2.title': 'Conectando a la Nube',
    'gateway.step2.message': 'Tu Gateway se está conectando a la nube...',
    'gateway.step2.registering': 'Registrando dispositivo...',
    'gateway.step2.claiming': 'Asignando a ubicación...',
    'gateway.step2.configuring': 'Configurando ajustes...',
    'gateway.step2.starting': 'Iniciando red de configuración...',
    
    'gateway.success.title': '¡Gateway En Línea! 🎉',
    'gateway.success.message': 'Tu Gateway ya está en línea y listo. La red de configuración está activa para agregar extensores.',
    'gateway.success.ssid': 'SSID de Configuración',
    'gateway.success.status': 'Estado',
    'gateway.success.location': 'Ubicación',
    'gateway.success.add.extender': 'Agregar Extensor',
    'gateway.success.finish': 'Finalizar Configuración',
    
    // Extender Flow
    'extender.step1.title': 'Agregar Extensor',
    'extender.step1.message': 'Para agregar un extensor, escaneo los dispositivos cercanos a través de Bluetooth. Si tu Extensor soporta Bluetooth, enciéndelo y aparecerá en la lista a continuación. También puedes escanear el código QR en tu dispositivo o ingresar el número de serie manualmente.',
    'extender.step1.bluetooth.scanning': 'Escaneo Bluetooth',
    'extender.step1.bluetooth.searching': 'Buscando dispositivos cercanos...',
    'extender.step1.bluetooth.none': 'No se encontraron dispositivos cercanos',
    'extender.step1.bluetooth.rescan': 'Volver a escanear',
    'extender.step1.selected': 'Dispositivo seleccionado',
    'extender.step1.or': 'o usa otro método',
    'extender.step1.scan': 'Escanear Código QR',
    'extender.step1.manual': 'Ingresar Número de Serie',
    
    'extender.step2.title': 'Ingresar Número de Serie',
    'extender.step2.message': 'Por favor ingresa el número de serie que se encuentra en la parte posterior de tu extensor.',
    'extender.step2.placeholder': 'ej., EXT-1234-5678-90AB',
    'extender.step2.submit': 'Continuar',
    'extender.step2.invalid': 'Por favor ingresa un número de serie válido',
    
    'extender.step3.title': 'Autorizando Dispositivo',
    'extender.step3.message': 'Agregando extensor a tu red...',
    'extender.step3.registering': 'Registrando extensor...',
    'extender.step3.binding': 'Vinculando a ubicación...',
    'extender.step3.whitelisting': 'Actualizando lista blanca MAC...',
    'extender.step3.authorized': '¡Extensor autorizado!',
    
    'extender.room.title': 'Establecer Ubicación de Habitación',
    'extender.room.message': '¿En qué habitación se colocará este extensor?',
    'extender.room.main.location': 'Ubicación Principal',
    'extender.room.living': 'Sala de Estar',
    'extender.room.bedroom': 'Habitación',
    'extender.room.kitchen': 'Cocina',
    'extender.room.bathroom': 'Baño',
    'extender.room.office': 'Oficina',
    'extender.room.garage': 'Garaje',
    'extender.room.custom': 'Habitación Personalizada',
    'extender.room.custom.placeholder': 'Ingresa el nombre de la habitación',
    'extender.room.continue': 'Continuar',
    
    'extender.poweron.title': 'Prepara tu Extensor',
    'extender.poweron.message': "¡Vamos a empezar! Por favor, sigue estos pasos para configurar tu extensor.",
    'extender.poweron.instruction1': 'Coloca el extensor en la ubicación deseada',
    'extender.poweron.instruction2': 'Conecta el adaptador de poder e insértalo',
    'extender.poweron.instruction3': 'Espera a que el LED se ponga sólido (aproximadamente 30-60 segundos)',
    'extender.poweron.confirm': 'El extensor está listo',
    
    'extender.step4.title': 'Enciende el Extensor',
    'extender.step4.message': 'Tu extensor ya está autorizado. Por favor enciéndelo para completar la configuración.',
    'extender.step4.instruction1': 'Coloca el extensor en la ubicación deseada',
    'extender.step4.instruction2': 'Enciende el extensor',
    'extender.step4.instruction3': 'Espera la conexión (puede tardar 1-2 minutos)',
    'extender.step4.ready': 'El extensor está encendido',
    
    'extender.step5.title': 'Conectando Extensor',
    'extender.step5.message': 'El extensor se está conectando a tu red...',
    'extender.step5.scanning': 'Buscando red de configuración...',
    'extender.step5.authenticating': 'Autenticando con Gateway...',
    'extender.step5.connecting': 'Conectando a la nube...',
    'extender.step5.finalizing': 'Aplicando configuración final...',
    
    'extender.success.title': '¡Extensor Conectado! 🎉',
    'extender.success.message': 'Tu extensor ya está en línea y extendiendo la cobertura de tu red.',
    'extender.success.device': 'Dispositivo',
    'extender.success.signal': 'Señal al Gateway',
    'extender.success.coverage': 'Área de Cobertura',
    'extender.success.add.another': 'Agregar Otro Extensor',
    'extender.success.finish': 'Finalizar Configuración',
    
    'extender.error.not.whitelisted': 'Conexión rechazada - dispositivo no autorizado',
    'extender.error.no.network': 'No se puede encontrar la red de configuración',
    'extender.error.timeout': 'Tiempo de espera agotado - por favor intenta de nuevo',
    
    // Device Detection (Legacy)
    'detect.searching': 'Genial! Estoy buscando tu router Wi-Fi...',
    'detect.found': '¡Perfecto! Encontré tu dispositivo:',
    'detect.confirm': '¿Es este tu router?',
    'detect.not.mine': 'Ese no es mío',
    'detect.correct': '¡Sí, es ese!',
    
    // Setup (Legacy)
    'setup.start': '¡Excelente! Déjame configurar tu red...',
    'setup.connecting': 'Conectando a tu router...',
    'setup.configuring': 'Optimizando configuración...',
    'setup.securing': 'Asegurando tu red...',
    'setup.finalizing': 'Finalizando...',
    
    // Success (Legacy)
    'success.title': '¡Todo listo! 🎉',
    'success.message': 'Tu red Gateway ahora está activa y optimizada. Puedes gestionar tu configuración en cualquier momento desde el panel.',
    'success.network.name': 'Nombre de Red',
    'success.devices': 'Dispositivos Conectados',
    'success.signal': 'Intensidad de Señal',
    'success.go.dashboard': 'Ir al Panel',
    
    // Error
    'error.title': '¡Ups! Algo salió mal',
    'error.connection': 'No pude conectar con el router. Esto podría deberse a:',
    'error.reason.power': 'El router no está encendido',
    'error.reason.distance': 'El dispositivo está muy lejos del router',
    'error.reason.network': 'Interferencia de red',
    'error.solutions': '¿Qué te gustaría hacer?',
    'error.retry.setup': 'Intentar de Nuevo',
    'error.manual.setup': 'Configuración Manual',
    'error.contact.support': 'Contactar Soporte',
    
    // Device Info
    'device.model': 'Modelo',
    'device.signal': 'Señal',
    'device.status': 'Estado',
    'device.status.online': 'En línea',
    'device.status.offline': 'Fuera de línea',
    
    // Accessibility
    'a11y.typing': 'El asistente está escribiין',
    'a11y.message.assistant': 'Mensaje del asistente',
    'a11y.message.user': 'Tu mensaje',
    'a11y.theme.toggle': 'Cambiar tema',
    'a11y.language.select': 'Seleccionar idioma',
    'a11y.progress': 'Progreso de configuración',
  },
  he: {
    // General
    'app.name': 'Gateway',
    'skip': 'דלג',
    'continue': 'המשך',
    'retry': 'נסה שוב',
    'done': 'סיום',
    'cancel': 'ביטול',
    'yes': 'כן',
    'no': 'לא',
    
    // Login
    'login.title': 'Heights',
    'login.subtitle': 'בחר איך אתה רוצה להתחבר',
    'login.method.title': 'בחר אسلوب התחברות',
    'login.method.local': 'התחבר עם מקומי',
    'login.method.local.description': 'התחבר ישירות לרשת המקומית שלך',
    'login.method.cloud': 'התחבר עם ענן',
    'login.method.cloud.description': 'גישה מרחוק באמצעות שירותים ענן',
    'login.form.title': 'פרטי התחברות',
    'login.form.username': 'שם משתמש',
    'login.form.email': 'כתובת אימייל',
    'login.form.password': 'סיסמה',
    'login.terms.agree': 'אני מסכים ל',
    'login.terms.link': 'תנאים והסכמים',
    'login.terms.required': 'עליך למסכים לתנאים כדי להמשיך',
    'login.error.method': 'אנא בחר אسلوب התחברות',
    'login.error.username': 'אנא הזן את שמך משתמש',
    'login.error.email': 'אנא הזן כתובת אימייל',
    'login.error.email.invalid': 'אנא הזן כתובת אימייל תקינה',
    'login.error.password': 'אנא הזן סיסמה',
    'login.error.password.short': 'הסיסמה חייבת להיות באורך של 6 תווים לפחות',
    'login.button': 'המשך',
    'login.footer': 'חיבור מאובטח • הגנה על הפרטיות',
    
    // Welcome
    'welcome.title': 'ברוכים הבאים ל-Heights!',
    'welcome.message': 'שלום! אני Janus, העוזר שלך ב-Heights. אעזור לך להגדיר את המכשירים שלך. מה תרצה להגדיר?',
    'welcome.setup.gateway': 'הגדר Gateway',
    'welcome.setup.extender': 'הוסף מרחיב טווח',
    
    // Gateway Flow
    'gateway.step1.title': 'חבר את ה-Gateway שלך',
    'gateway.step1.message': 'אנא ודא שה-Gateway מופעל וכבל ה-Ethernet של WAN מחובר.',
    'gateway.step1.instruction1': 'הפעל את מכשיר ה-Gateway',
    'gateway.step1.instruction2': 'חבר כבל Ethernet WAN',
    'gateway.step1.instruction3': 'המתן עד שנורית ה-LED תהיה כחולה מלאה',
    'gateway.step1.ready': 'חיברתי אותו',
    
    // Gateway Onboarding - Location
    'gateway.location.title': 'קביעת מיקום',
    'gateway.location.message': 'איפה אתה מגדיר את ה-Gateway הזה?',
    'gateway.location.myhome.suffix': '\'s Home',
    'gateway.location.floor1': 'קומה 1',
    'gateway.location.floor2': 'קומה 2',
    'gateway.location.floor3': 'קומה 3',
    'gateway.location.custom': 'מיקום מותאם אישית',
    'gateway.location.custom.placeholder': 'הזן את שם המיקום',
    'gateway.location.continue': 'המשך',
    
    // Gateway WAN Configuration
    'gateway.wan.title': 'הגדרת WAN',
    'gateway.wan.message': 'كيف מתחבר ה-Gateway שלך לאינטרנט?',
    'gateway.wan.recommended': 'מומלץ',
    'gateway.wan.optional': 'אופציונלי',
    'gateway.wan.dhcp.title': 'DHCP (אוטומטי)',
    'gateway.wan.dhcp.desc': 'קבלת כתובת IP אוטומטית מהספק שלך',
    'gateway.wan.pppoe.title': 'PPPoE',
    'gateway.wan.pppoe.desc': 'התחבר באמצעות שם משתמש וסיסמה מהספק שלך',
    'gateway.wan.pppoe.config': 'הגדרות PPPoE',
    'gateway.wan.pppoe.username': 'שם משתמש',
    'gateway.wan.pppoe.username.placeholder': 'הזן שם משתמש PPPoE',
    'gateway.wan.pppoe.password': 'סיסמה',
    'gateway.wan.pppoe.password.placeholder': 'הזן סיסמה PPPoE',
    'gateway.wan.static.title': 'IP סטטית',
    'gateway.wan.static.desc': 'הגדרות IP סטטיות ידניות',
    'gateway.wan.static.config': 'הגדרות IP סטטית',
    'gateway.wan.static.ip': 'כתובת IP',
    'gateway.wan.static.subnet': 'מסכתת תת-רשת',
    'gateway.wan.static.gateway': 'ゲטเวยי ברירת מחדל',
    'gateway.wan.static.dns1': 'DNS ראשי',
    'gateway.wan.static.dns2': 'DNS משני',
    
    // Gateway Selection for Extender
    'gateway.select.title': 'בחירת Gateway',
    'gateway.select.message': 'ל_gateway איזה אתה רוצה להוסיף את המרחיב?',
    'gateway.select.nogateways': 'לא נמצאו Gateways. עליך להגדיר Gateway ראשון לפני הוספת מרחיבים.',
    'gateway.select.required': 'Gateway נדרש',
    'gateway.select.required.desc': 'מרחיבים צריכים להתחבר ל-Gateway קיים. אנא הגדר את ה-Gateway שלך תחילה.',
    'gateway.select.setup.first': 'הגדר את ה-Gateway שלך כדי להתחיל',
    'gateway.select.add.another': 'הוסף Gateway נוסף',
    
    'gateway.step2.title': 'מתחבר לענן',
    'gateway.step2.message': 'ה-Gateway שלך מתחבר לענן...',
    'gateway.step2.registering': 'רשום מכשיר...',
    'gateway.step2.claiming': 'מקצה למיקום...',
    'gateway.step2.configuring': 'מגדי�� הגדרות...',
    'gateway.step2.starting': 'מפעיל רשת הגדרה...',
    
    'gateway.success.title': 'Gateway מקוון! 🎉',
    'gateway.success.message': 'ה-Gateway שלך כעת מקוון ומוכן. רשת ההגדרה פעילה להוספת מרחיבי טווח.',
    'gateway.success.ssid': 'SSID הגדרה',
    'gateway.success.status': 'מצב',
    'gateway.success.location': 'מיקום',
    'gateway.success.add.extender': 'הוסף מרחיב טווח',
    'gateway.success.finish': 'סיים הגדרה',
    
    // Extender Flow
    'extender.step1.title': 'הוסף מרחיב טווח',
    'extender.step1.message': 'כדי להוסיף מרחיב טווח, אני סורק מכשירים קרובים דרך בלוטוס. אם המרחיב שלך תומך בלוטוס, הפעל אותו והוא יופיע ברשימה למטה. אתה גם יכול לסרוק את קוד ה-QR על המכשיר שלך או להזין את המספר הסידורי ידנית.',
    'extender.step1.bluetooth.scanning': 'סרוק בלוטוס',
    'extender.step1.bluetooth.searching': 'מחפש מכשירים קרובים...',
    'extender.step1.bluetooth.none': 'לא נמצאו מכשירים קרובים',
    'extender.step1.bluetooth.rescan': 'סרוק שוב',
    'extender.step1.selected': 'מכשיר נבחר',
    'extender.step1.or': 'או השתמש בשיטה אחרת',
    'extender.step1.scan': 'סרוק קוד QR',
    'extender.step1.manual': 'הזן מספר סידורי',
    
    'extender.step2.title': 'הזן מספר סידורי',
    'extender.step2.message': 'אנא הזן את המספר הסידורי שנמצא בגב של מרחיב הטווח שלך.',
    'extender.step2.placeholder': 'לדוגמה, EXT-1234-5678-90AB',
    'extender.step2.submit': 'המשך',
    'extender.step2.invalid': 'אנא הזן מספר סידורי תקין',
    
    'extender.step3.title': 'מאשר מכשיר',
    'extender.step3.message': 'מוסיף מרחיב טווח לרשת שלך...',
    'extender.step3.registering': 'רושם מרחיב טווח...',
    'extender.step3.binding': 'מחבר למיקום...',
    'extender.step3.whitelisting': 'מעדכן רשימה לבנה של MAC...',
    'extender.step3.authorized': 'מרחיב טווח מאושר!',
    
    'extender.room.title': 'קביעת מיקום חדר',
    'extender.room.message': 'באיזה חדר ימצא מרחיב הטווח הזה?',
    'extender.room.main.location': 'מיקום עיקרי',
    'extender.room.living': 'חדר מגורים',
    'extender.room.bedroom': 'חדר שינה',
    'extender.room.kitchen': 'מטבח',
    'extender.room.bathroom': 'אמבטיה',
    'extender.room.office': 'משר',
    'extender.room.garage': 'מחסן',
    'extender.room.custom': 'חדר מותאם אישית',
    'extender.room.custom.placeholder': 'הזן את שם החדר',
    'extender.room.continue': 'המשך',
    
    'extender.poweron.title': 'הعد את המרחיב שלך',
    'extender.poweron.message': "בואו נתחיל! אנא עקוב אחר השלבים המבוקשים להגדיר את המרחיב שלך.",
    'extender.poweron.instruction1': 'הצב את המרחיב במקום המבוקש',
    'extender.poweron.instruction2': 'חבר את מתח המרחב ותנגן אותו',
    'extender.poweron.instruction3': 'המתן עד שנורית ה-LED תстанה כחולה (כ-30-60 שניות)',
    'extender.poweron.confirm': 'המרחיב שלך מוכן',
    
    'extender.step4.title': 'הפעל מרחיב טווח',
    'extender.step4.message': 'מרחיב הטווח שלך כעת מאושר. אנא הפעל אותו להשלמת ההגדרה.',
    'extender.step4.instruction1': 'מקם את מרחיב הטווח במיקום הרצוי',
    'extender.step4.instruction2': 'הפעל את מרחיב הטווח',
    'extender.step4.instruction3': 'המתן לחיבור (עשוי לקחת 1-2 דקות)',
    'extender.step4.ready': 'מרחיב הטווח מופעל',
    
    'extender.step5.title': 'מחבר מרחיב טווח',
    'extender.step5.message': 'מרחיב הטווח מתחבר לרשת שלך...',
    'extender.step5.scanning': 'סורק רשת הגדרה...',
    'extender.step5.authenticating': 'מאמת עם Gateway...',
    'extender.step5.connecting': 'מתחבר לענן...',
    'extender.step5.finalizing': 'מיישם תצורה סופית...',
    
    'extender.success.title': 'מרחיב טווח מחובר! 🎉',
    'extender.success.message': 'מרחיב הטווח שלך כעת מקוון ומרחיב את כיסוי הרשת שלך.',
    'extender.success.device': 'מכשיר',
    'extender.success.signal': 'אות ל-Gateway',
    'extender.success.coverage': 'אזור כיסוי',
    'extender.success.add.another': 'הוסף מרחיב טווח נוסף',
    'extender.success.finish': 'סיים הגדרה',
    
    'extender.error.not.whitelisted': 'חיבור נדחה - מכשיר לא מאושר',
    'extender.error.no.network': 'לא ניתן למצוא רשת הגדרה',
    'extender.error.timeout': 'תם זמן חיבור - אנא נסה שוב',
    
    // Device Detection (Legacy)
    'detect.searching': 'מעולה! אני סורק את הנתב שלך...',
    'detect.found': 'מצוין! מצאתי את המכשיר שלך:',
    'detect.confirm': 'האם זה הנתב שלך?',
    'detect.not.mine': 'זה לא שלי',
    'detect.correct': 'כן, זה הוא!',
    
    // Setup (Legacy)
    'setup.start': 'נהדר! תן לי להגדיר את הרשת שלך...',
    'setup.connecting': 'מתחבר לנתב שלך...',
    'setup.configuring': 'מייעל הגדרות...',
    'setup.securing': 'מאבטח את הרשת שלך...',
    'setup.finalizing': 'משלים...',
    
    // Success (Legacy)
    'success.title': 'הכל מוכן! 🎉',
    'success.message': 'רשת Gateway שלך פעילה ומאופטמלת. אתה יכול לנהל את ההגדרות שלך בכל עת מלוח הבקרה.',
    'success.network.name': 'שם רשת',
    'success.devices': 'מכשירים מחוברים',
    'success.signal': 'עוצמת אות',
    'success.go.dashboard': 'עבור ללוח בקרה',
    
    // Error
    'error.title': 'אופס! משהו השתבש',
    'error.connection': 'לא הצלחתי להתחבר לנתב. זה יכול להיות בגלל:',
    'error.reason.power': 'הנתב לא מופעל',
    'error.reason.distance': 'המכשיר רחוק מדי מהנתב',
    'error.reason.network': 'הפרעות רשת',
    'error.solutions': 'מה תרצה לעשות?',
    'error.retry.setup': 'נסה שוב',
    'error.manual.setup': 'התקנה ידנית',
    'error.contact.support': 'צור קשר עם תמיכה',
    
    // Device Info
    'device.model': 'דגם',
    'device.signal': 'אות',
    'device.status': 'מצב',
    'device.status.online': 'מחובר',
    'device.status.offline': 'לא מחובר',
    
    // Accessibility
    'a11y.typing': 'העוזר מקליד',
    'a11y.message.assistant': 'הודעת עוזר',
    'a11y.message.user': 'ההודעה שלך',
    'a11y.theme.toggle': 'החלף ערכת נושא',
    'a11y.language.select': 'בחר שפה',
    'a11y.progress': 'התקדמות התקנה',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gateway-language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'he';

  useEffect(() => {
    localStorage.setItem('gateway-language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}