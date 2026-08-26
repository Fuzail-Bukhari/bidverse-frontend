import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const HeroScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x6366f1, 1, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Create hammer group
    const hammerGroup = new THREE.Group();

    // Hammer handle
    const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      metalness: 0.3,
      roughness: 0.7,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI / 4;
    hammerGroup.add(handle);

    // Hammer head
    const headGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.5);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0.9, 0.9, 0);
    hammerGroup.add(head);

    scene.add(hammerGroup);

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Ring
    const ringGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 1,
      roughness: 0,
      transparent: true,
      opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.01, 16, 100),
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.2,
      })
    );
    scene.add(ring2);

    // GSAP animations
    gsap.to(hammerGroup.rotation, {
      y: Math.PI * 2,
      duration: 8,
      repeat: -1,
      ease: "none",
    });

    gsap.to(hammerGroup.position, {
      y: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    gsap.to(ring.rotation, {
      z: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "none",
    });

    gsap.to(ring2.rotation, {
      z: -Math.PI * 2,
      x: Math.PI,
      duration: 15,
      repeat: -1,
      ease: "none",
    });

    gsap.to(hammerGroup.scale, {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      // Smooth camera follow mouse
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default HeroScene;