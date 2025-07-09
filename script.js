// --- 1. THIẾT LẬP CƠ BẢN ---
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 2. TẠO CÁC ĐỐI TƯỢNG RƠI ---
const objectsToFall = [];
const textureLoader = new THREE.TextureLoader();
const textMessages = [
    // 'Anh yêu em', 'I love you',
    'Gửi ngàn tim ❤️', 'Mãi yêuuu',
    'U r my sunshine', 'Bé iu',
    'Bà Mu votu'
];
const imagePaths = [
    'images/img1.jpg',
    'images/img2.jpg',
    'images/img3.jpg',
    'images/img4.jpg',
    'images/img5.jpg',
    'images/img6.jpg'
];

function createTextObject(text) {
    const canvas2d = document.createElement('canvas');
    const context = canvas2d.getContext('2d');
    canvas2d.width = 256;
    canvas2d.height = 128;
    context.font = 'bold 30px Arial';
    context.fillStyle = 'pink';
    context.textAlign = 'center';
    context.fillText(text, canvas2d.width / 2, canvas2d.height / 2);
    const texture = new THREE.CanvasTexture(canvas2d);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(2, 1);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createImageObject(imagePath) {
    const texture = textureLoader.load(imagePath);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

// Tạo vật thể chữ
for (let i = 0; i < 20; i++) {
    const randomText = textMessages[Math.floor(Math.random() * textMessages.length)];
    const textObject = createTextObject(randomText);
    objectsToFall.push(textObject);
}

// Tạo vật thể ảnh
for (let i = 0; i < 10; i++) {
    const randomImage = imagePaths[Math.floor(Math.random() * imagePaths.length)];
    const imageObject = createImageObject(randomImage);
    objectsToFall.push(imageObject);
}

// Đặt vị trí ngẫu nhiên cho tất cả vật thể
objectsToFall.forEach(obj => {
    obj.position.x = (Math.random() - 0.5) * 10;
    // **SỬA LỖI:** Rải các vật thể ra khắp chiều dọc màn hình để tạo hiệu ứng liên tục
    obj.position.y = (Math.random() * 20) - 10; // Phân bổ ngẫu nhiên từ y = -10 đến y = +10
    obj.position.z = (Math.random() - 0.5) * 5;

    // Đặt độ xoay ngẫu nhiên ban đầu
    obj.rotation.x = (Math.random() - 0.5) * 0.4;
    obj.rotation.y = (Math.random() - 0.5) * 0.4;

    scene.add(obj);
});

// --- 3. TẠO VÒNG LẶP ANIMATION ---
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Cập nhật vị trí của từng vật thể
    objectsToFall.forEach(obj => {
        // Cho vật thể rơi xuống
        obj.position.y -= 0.02;

        // Tạo hiệu ứng lắc lư nhẹ
        obj.rotation.x = Math.sin(elapsedTime + obj.position.y * 0.5) * 0.15;
        obj.rotation.y = Math.sin(elapsedTime + obj.position.z * 0.5) * 0.2;
        obj.rotation.z = Math.sin(elapsedTime + obj.position.x * 0.5) * 0.15;

        // Nếu vật thể rơi xuống dưới màn hình, đưa nó lên lại trên cùng
        if (obj.position.y < -10) { // Cập nhật giới hạn dưới cho khớp với vị trí ban đầu
            obj.position.y = 10;
            obj.position.x = (Math.random() - 0.5) * 10;
        }
    });

    // Vẽ lại cảnh
    renderer.render(scene, camera);

    // Gọi lại hàm tick ở khung hình tiếp theo
    window.requestAnimationFrame(tick);
};

tick();

// --- 4. XỬ LÝ KHI THAY ĐỔI KÍCH THƯỚC CỬA SỔ ---
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
