import * as THREE from './node_modules/three/build/three.module.js';

const canvas = document.getElementById('drawing-board');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});