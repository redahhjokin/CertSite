document.addEventListener('DOMContentLoaded', () => {
    // CUSTOMIZATION CONFIGURATION
    // Separate configurations for certificates with and without pictures
    const CERTIFICATE_CONFIG = {
        withPicture: {
            // Picture placement (x, y, radius)
            picture: {
                x: 800,      // Horizontal center position
                y: 835,      // Vertical position
                radius: 300, // Size of circular crop
                scale: 1     // Scale factor for picture size
            },
            // Name placement (x, y, font settings)
            name: {
                x: 800,      // Horizontal center position
                y: 1260,     // Vertical position
                fontSize: 84,// Font size
                fontFamily: '"Segoe UI", Arial, sans-serif', // Font family
                color: '#ffffff' // Text color
            },
            // Signature placement (x, y, font settings)
            signature: {
                x: 760,      // Always Start at x position == 760px
                y: 1910,     // Vertical position
                fontSize: 68,// Font size
                fontFamily: '"Segoe UI", Arial, sans-serif', // Font family
                color: '#188995' // Text color
            }
        },
        withoutPicture: {
            // Separate configuration for certificates without pictures
            name: {
                x: 800,      // Horizontal center position
                y: 950,      // Vertical position
                fontSize: 82,// Larger font size
                fontFamily: '"Segoe UI", Arial, sans-serif', // Font family
                color: '#ffffff' // Text color
            },
            // Signature placement (x, y, font settings)
            signature: {
                x: 760,      // Fixed horizontal position
                y: 1650,     // Vertical position
                fontSize: 68,// Slightly larger font size
                fontFamily: '"Segoe UI", Arial, sans-serif', // Font family
                color: '#188995' // Text color
            }
        }
    };

    // Expose configuration for external modification
    window.updateCertificateConfig = function(config) {
        Object.keys(config).forEach(key => {
            if (CERTIFICATE_CONFIG[key]) {
                Object.assign(CERTIFICATE_CONFIG[key], config[key]);
            }
        });
    };

    const form = document.getElementById('certificateForm');
    const includePictureCheckbox = document.getElementById('includePicture');
    const pictureInput = document.getElementById('pictureInput');
    const certificatePreview = document.getElementById('certificatePreview');
    const certificateContainer = document.getElementById('certificateContainer');
    const downloadCertificateBtn = document.getElementById('downloadCertificate');
    const languageToggle = document.querySelector('.language-toggle');
    const htmlRoot = document.getElementById('htmlRoot');

    // Language Toggle Functionality
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const currentLang = htmlRoot.getAttribute('dir');
            
            if (currentLang === 'rtl') {
                // Switch to English
                htmlRoot.setAttribute('dir', 'ltr');
                htmlRoot.setAttribute('lang', 'en');
                
                // Change button text
                languageToggle.querySelector('span').textContent = 'عربي';
                
                // Change all text elements
                document.querySelectorAll('[data-en]').forEach(el => {
                    if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                        el.placeholder = el.getAttribute('data-en-placeholder') || '';
                        el.removeAttribute('dir');
                    }
                    el.textContent = el.getAttribute('data-en');
                });
            } else {
                // Switch to Arabic
                htmlRoot.setAttribute('dir', 'rtl');
                htmlRoot.setAttribute('lang', 'ar');
                
                // Change button text
                languageToggle.querySelector('span').textContent = 'English';
                
                // Change all text elements
                document.querySelectorAll('[data-ar]').forEach(el => {
                    if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                        el.placeholder = el.getAttribute('data-ar-placeholder') || '';
                        el.setAttribute('dir', 'rtl');
                    }
                    el.textContent = el.getAttribute('data-ar');
                });
            }
        });
    }

    // Picture Input Toggle
    includePictureCheckbox.addEventListener('change', () => {
        pictureInput.style.display = includePictureCheckbox.checked ? 'block' : 'none';
    });

    // Certificate Generation
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const signature = document.getElementById('signature').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        let pictureDataURL = null;

        // Select Certificate Template
        const selectTemplate = (gender, hasPicture) => {
            if (gender === 'male') {
                return hasPicture ? 'templates/male-certificate.jpg' : 'templates/male-no-certificate.jpg';
            } else {
                return hasPicture ? 'templates/female-certificate.jpg' : 'templates/female-no-certificate.jpg';
            }
        };

        // Picture Handling
        if (includePictureCheckbox.checked && pictureInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                pictureDataURL = event.target.result;
                generateCertificate(fullName, signature, gender, pictureDataURL, selectTemplate(gender, true));
            };
            reader.readAsDataURL(pictureInput.files[0]);
        } else {
            generateCertificate(fullName, signature, gender, null, selectTemplate(gender, false));
        }
    });

    function generateCertificate(fullName, signature, gender, pictureDataURL, templateSrc) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = function() {
            canvas.width = 1600;
            canvas.height = 2000;
            
            // Draw background template
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Determine text direction and font
            const isArabic = htmlRoot.getAttribute('dir') === 'rtl';
            ctx.textAlign = 'center';
            
            // Select configuration based on picture presence
            const config = pictureDataURL ? 
                CERTIFICATE_CONFIG.withPicture : 
                CERTIFICATE_CONFIG.withoutPicture;

            // Add Name
            ctx.font = `bold ${config.name.fontSize}px ${config.name.fontFamily}`;
            ctx.fillStyle = config.name.color;
            ctx.fillText(fullName, config.name.x, config.name.y);

            // Add Signature
            ctx.font = `${config.signature.fontSize}px ${config.signature.fontFamily}`;
            ctx.fillStyle = config.signature.color;
            ctx.fillText(signature, config.signature.x, config.signature.y);

            // Add Circular Profile Picture if present
            if (pictureDataURL) {
                const picture = new Image();
                picture.onload = function() {
                    // Create circular clipping path
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(
                        config.picture.x, 
                        config.picture.y, 
                        config.picture.radius, 
                        0, 
                        Math.PI * 2, 
                        true
                    );
                    ctx.closePath();
                    ctx.clip();

                    // Draw picture
                    const scale = config.picture.scale * 
                        Math.max(
                            config.picture.radius * 2 / picture.width, 
                            config.picture.radius * 2 / picture.height
                        );
                    const scaledWidth = picture.width * scale;
                    const scaledHeight = picture.height * scale;
                    const offsetX = config.picture.x - scaledWidth / 2;
                    const offsetY = config.picture.y - scaledHeight / 2;

                    ctx.drawImage(picture, offsetX, offsetY, scaledWidth, scaledHeight);
                    ctx.restore();

                    displayCertificate(canvas);
                };
                picture.src = pictureDataURL;
            } else {
                displayCertificate(canvas);
            }
        };
        img.src = templateSrc || 'https://via.placeholder.com/1600x2000.png?text=Certificate+Template';
    }

    function displayCertificate(canvas) {
        certificateContainer.innerHTML = '';
        certificateContainer.appendChild(canvas);
        certificatePreview.classList.remove('hidden');
    }

    // Download Certificate
    downloadCertificateBtn.addEventListener('click', () => {
        const canvas = certificateContainer.querySelector('canvas');
        const fullName = document.getElementById('fullName').value;
        const link = document.createElement('a');
        link.download = `${fullName}_certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});