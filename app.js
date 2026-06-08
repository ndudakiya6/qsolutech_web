/**
 * QSolutech — Advanced 3D Visual Engine v2.0
 * Premium scroll animations, particle systems, cursor, and immersive 3D
 */

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // 1. SMOOTH SCROLL ENGINE (LENIS)
    // ============================================================
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // ============================================================
    // 2. CUSTOM CURSOR
    // ============================================================
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // ============================================================
    // 3. NAVIGATION SCROLL STATE
    // ============================================================
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 80);
        }
    });

    // ============================================================
    // 4. THREE.JS IMMERSIVE 3D SCENE
    // ============================================================
    const canvas = document.querySelector('#webgl-background');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Central Torus Knot (more complex than plain torus) ---
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.4, 0.38, 180, 24, 2, 3);
    const torusKnotMat = new THREE.MeshBasicMaterial({
        color: '#00ffcc',
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    scene.add(torusKnot);

    // --- Secondary outer ring ---
    const outerRingGeo = new THREE.TorusGeometry(2.6, 0.015, 6, 200);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: '#7000ff', transparent: true, opacity: 0.3 });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI * 0.3;
    scene.add(outerRing);

    // --- Third decorative ring ---
    const ring2Geo = new THREE.TorusGeometry(3.2, 0.01, 6, 200);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: '#ff007f', transparent: true, opacity: 0.15 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.5;
    ring2.rotation.y = Math.PI * 0.2;
    scene.add(ring2);

    // --- Deep particle field ---
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        particleSizes[i] = Math.random() * 0.03 + 0.005;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.018, color: '#7000ff', transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Accent scatter ---
    const accentCount = 300;
    const accentPos = new Float32Array(accentCount * 3);
    for (let i = 0; i < accentCount; i++) {
        accentPos[i * 3] = (Math.random() - 0.5) * 14;
        accentPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
        accentPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPos, 3));
    const accentParticles = new THREE.Points(accentGeo, new THREE.PointsMaterial({ size: 0.025, color: '#ff007f', transparent: true, opacity: 0.25 }));
    scene.add(accentParticles);

    // --- Mouse tracking ---
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    window.addEventListener('mousemove', (e) => {
        pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
        pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // --- Scroll progress ---
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    });

    // --- Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Render loop ---
    const clock = new THREE.Clock();
    function renderLoop() {
        const t = clock.getElapsedTime();

        // Torus knot rotation
        torusKnot.rotation.x = t * 0.12;
        torusKnot.rotation.y = t * 0.18;
        torusKnot.rotation.z = t * 0.06;

        // Pulse opacity based on time
        torusKnotMat.opacity = 0.12 + Math.sin(t * 0.8) * 0.06;

        // Rings
        outerRing.rotation.z = t * 0.05;
        outerRing.rotation.y = t * 0.03;
        ring2.rotation.z = -t * 0.04;
        ring2.rotation.x = t * 0.02;

        // Particles drift
        particles.rotation.y = t * 0.015;
        particles.rotation.x = t * 0.008;
        accentParticles.rotation.y = -t * 0.012;

        // Smooth mouse tracking
        targetX += (pointerX * 0.4 - targetX) * 0.04;
        targetY += (pointerY * 0.4 - targetY) * 0.04;
        scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
        scene.rotation.x += (-targetY * 0.3 - scene.rotation.x) * 0.05;

        // Scroll-driven z push
        camera.position.z = 6 - scrollProgress * 2.5;
        torusKnot.position.x = scrollProgress * -3.5;
        torusKnot.position.y = scrollProgress * 0.5;

        renderer.render(scene, camera);
        requestAnimationFrame(renderLoop);
    }
    renderLoop();


    // ============================================================
    // 5. GSAP SCROLL ANIMATIONS
    // ============================================================
    gsap.registerPlugin(ScrollTrigger);

    // Sync GSAP with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#00ffcc,#7000ff);z-index:9999;width:0%;transition:width 0.1s;';
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = pct + '%';
    });

    // Stats counters
    document.querySelectorAll('.counter').forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        gsap.to(counter, {
            scrollTrigger: { trigger: counter, start: 'top 88%' },
            innerText: target,
            duration: 2.5,
            snap: { innerText: 1 },
            ease: 'power2.out'
        });
    });

    // Staggered card reveals
    gsap.utils.toArray('.programs-grid .program-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            y: 60,
            rotateX: 10,
            duration: 1,
            delay: i * 0.15,
            ease: 'power3.out'
        });
    });

    // Roadmap steps stagger
    gsap.utils.toArray('.roadmap-step').forEach((step, i) => {
        gsap.from(step, {
            scrollTrigger: { trigger: step, start: 'top 85%' },
            opacity: 0,
            x: -40,
            duration: 0.9,
            delay: i * 0.12,
            ease: 'power3.out'
        });
    });

    // Horizontal parallax on hero content
    gsap.to('.hero .content-box', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -80,
        opacity: 0.3
    });

    // Stats bar parallax
    gsap.from('.stats-bar', {
        scrollTrigger: { trigger: '.stats-bar', start: 'top 90%' },
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out'
    });


    // ============================================================
    // 6. INTERSECTION OBSERVER FOR MOTION REVEALS
    // ============================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, idx * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.motion-reveal, .motion-reveal-left, .motion-reveal-right').forEach(el => revealObserver.observe(el));


    // ============================================================
    // 7. FORM HANDLING
    // ============================================================
    const dropzone = document.getElementById('dropzone');
    const dropzoneText = document.getElementById('dropzoneText');
    const fileInput = document.getElementById('fileInput');
    const applicationForm = document.getElementById('applicationForm');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--primary)'; });
        dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = ''; });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                if (dropzoneText) dropzoneText.innerText = `✓ ${e.dataTransfer.files[0].name}`;
                dropzone.style.borderColor = 'var(--primary)';
                dropzone.style.boxShadow = '0 0 30px rgba(0,255,204,0.15)';
            }
        });
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length && dropzoneText) {
                dropzoneText.innerText = `✓ ${fileInput.files[0].name}`;
                dropzone.style.borderColor = 'var(--primary)';
                dropzone.style.boxShadow = '0 0 30px rgba(0,255,204,0.15)';
            }
        });
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const phone = document.getElementById('formPhone').value;
            const track = document.getElementById('formTrack').value;
            const college = document.getElementById('formCollege').value;
            const resumeName = fileInput && fileInput.files[0] ? fileInput.files[0].name : "Resume.pdf";

            const newApplication = { name, email, phone, track, college, resumeName, id: Date.now() };
            const currentApps = JSON.parse(localStorage.getItem('qsolutech_apps')) || [];
            currentApps.push(newApplication);
            localStorage.setItem('qsolutech_apps', JSON.stringify(currentApps));

            // Animated success feedback
            const btn = applicationForm.querySelector('button[type="submit"]');
            const origText = btn.textContent;
            btn.textContent = '✓ Application Received';
            btn.style.background = '#00a87e';
            setTimeout(() => { btn.textContent = origText; btn.style.background = ''; }, 3000);

            applicationForm.reset();
            if (dropzoneText) { dropzoneText.innerText = 'Drag & drop your file here or click to browse'; }
            if (dropzone) { dropzone.style.borderColor = ''; dropzone.style.boxShadow = ''; }
        });
    }


    // ============================================================
    // 8. TEXT CHAR SPLIT ANIMATION (for section titles)
    // ============================================================
    document.querySelectorAll('.char-split').forEach(el => {
        const text = el.textContent;
        el.innerHTML = text.split('').map((char, i) =>
            `<span style="display:inline-block;opacity:0;transform:translateY(30px);transition:opacity 0.5s ${i * 0.03}s,transform 0.5s ${i * 0.03}s cubic-bezier(.16,1,.3,1)">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const charObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('span').forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    charObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        charObserver.observe(el);
    });

});
