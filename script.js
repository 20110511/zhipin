// 校园智评推广网站交互脚本

document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化所有功能
    initScrollAnimations();
    initNavigationScroll();
    initImageLazyLoading();
    initFormHandling();
    initMobileMenu();
    initImageGallery();
    
    // 图片数据管理 - 延迟执行确保DOM完全加载
    setTimeout(() => {
        const imageManager = new ImageManager();
    }, 100);
});

// 图片管理类
class ImageManager {
    constructor() {
        // 直接定义图片配置，避免CORS问题
        this.imageConfig = {
            "version": "1.0.0",
            "description": "校园智评推广网站图片配置文件",
            "images": {
                "hero-dashboard": {
                    "filename": "hero-dashboard.png",
                    "alt": "校园智评系统主界面展示",
                    "description": "系统主页面，展示数据概览和核心功能入口",
                    "category": "hero",
                    "size": "large",
                    "dimensions": "600x400"
                },
                "screenshot-dashboard": {
                    "filename": "screenshot-dashboard.png",
                    "alt": "数据概览界面截图",
                    "description": "管理员数据概览界面，显示班级排行榜、统计图表等",
                    "category": "screenshot",
                    "size": "large",
                    "dimensions": "800x600"
                },
                "screenshot-class": {
                    "filename": "screenshot-class.png",
                    "alt": "班级管理界面截图",
                    "description": "班级管理界面，展示年级、班级列表和学生信息",
                    "category": "screenshot",
                    "size": "medium",
                    "dimensions": "400x300"
                },
                "screenshot-score": {
                    "filename": "screenshot-score.png",
                    "alt": "评分管理界面截图",
                    "description": "评分管理界面，显示评分项目设置和记录管理",
                    "category": "screenshot",
                    "size": "medium",
                    "dimensions": "400x300"
                },
                "screenshot-user": {
                    "filename": "screenshot-user.png",
                    "alt": "用户管理界面截图",
                    "description": "用户管理界面，展示不同角色用户和权限设置",
                    "category": "screenshot",
                    "size": "medium",
                    "dimensions": "400x300"
                },
                "screenshot-poster": {
                    "filename": "screenshot-poster.png",
                    "alt": "海报管理界面截图",
                    "description": "海报管理界面，展示班级海报上传和展示功能",
                    "category": "screenshot",
                    "size": "medium",
                    "dimensions": "400x300"
                },
                "tech-architecture": {
                    "filename": "tech-architecture.png",
                    "alt": "技术架构图",
                    "description": "系统技术架构示意图，展示前后端技术栈",
                    "category": "diagram",
                    "size": "medium",
                    "dimensions": "400x400"
                }
            }
        };
        this.loadImages();
    }
    
    loadImages() {
        // 直接使用配置，无需异步加载
        this.updateImageSources();
    }
    
    updateImageSources() {
        // 更新各个图片元素的src
        Object.keys(this.imageConfig.images).forEach(key => {
            const elements = document.querySelectorAll(`img[src*="${key}"]`);
            elements.forEach(img => {
                const imagePath = `images/${this.imageConfig.images[key].filename}`;
                // 检查图片是否存在，不存在则使用占位图
                this.checkImageExists(imagePath, img, this.imageConfig.images[key]);
            });
        });
    }
    
    checkImageExists(imagePath, imgElement, config) {
        const testImg = new Image();
        testImg.onload = () => {
            // 图片存在，使用真实图片
            imgElement.src = imagePath;
            imgElement.alt = config.alt;
        };
        testImg.onerror = () => {
            // 图片不存在，使用占位图
            const placeholderUrl = this.generatePlaceholder(config);
            imgElement.src = placeholderUrl;
            imgElement.alt = config.alt;
        };
        testImg.src = imagePath;
    }
    
    generatePlaceholder(config) {
        const dimensions = config.dimensions || '400x300';
        const [width, height] = dimensions.split('x');
        const text = encodeURIComponent(config.alt || '图片');
        return `https://via.placeholder.com/${width}x${height}/2c3e50/ffffff?text=${text}`;
    }
    
    useDefaultImages() {
        // 这个方法现在不再需要，图片检查在 checkImageExists 中处理
        console.log('使用智能图片检查，自动处理占位图');
    }
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotate(-0.5deg)';
                
                // 为特色卡片添加延迟动画
                if (entry.target.classList.contains('feature-card')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                    entry.target.classList.add('animate-in');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.section-title, .feature-card, .screenshot-item, .tech-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) rotate(-2deg)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// 导航滚动
function initNavigationScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 添加点击动画效果
                this.style.transform = 'rotate(-2deg) scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // 平滑滚动
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 导航栏滚动效果
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
        
        // 添加微妙的倾斜效果
        const tilt = Math.sin(currentScrollY * 0.01) * 0.2;
        navbar.style.transform = `rotate(${tilt}deg)`;
        
        lastScrollY = currentScrollY;
    });
}

// 图片懒加载
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// 表单处理
function initFormHandling() {
    const form = document.querySelector('.form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 添加提交动画
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '提交中...';
            submitBtn.style.transform = 'rotate(-1deg) scale(0.95)';
            submitBtn.disabled = true;
            
            // 模拟提交过程
            setTimeout(() => {
                submitBtn.textContent = '提交成功！';
                submitBtn.style.background = '#27ae60';
                submitBtn.style.borderColor = '#27ae60';
                
                // 添加成功动画
                submitBtn.style.transform = 'rotate(0deg) scale(1.05)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.transform = '';
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                    this.reset();
                }, 2000);
                
            }, 1500);
        });
        
        // 输入框焦点效果
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'rotate(0deg) scale(1.02)';
                this.style.zIndex = '10';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = '';
                this.style.zIndex = '';
            });
        });
    }
}

// 移动端菜单
function initMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    // 创建汉堡菜单按钮
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = `
        <div class="hamburger-lines">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    // 添加汉堡菜单样式
    const hamburgerStyle = document.createElement('style');
    hamburgerStyle.textContent = `
        .menu-toggle {
            display: none;
            background: var(--white);
            border: 3px solid var(--primary-color);
            width: 50px;
            height: 50px;
            cursor: pointer;
            transform: rotate(-2deg);
            transition: all 0.3s ease;
            box-shadow: 4px 4px 0px var(--accent-color);
            padding: 8px;
        }
        
        .hamburger-lines {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            gap: 4px;
        }
        
        .hamburger-lines span {
            display: block;
            height: 3px;
            width: 100%;
            background: var(--primary-color);
            transition: all 0.3s ease;
            transform-origin: center;
        }
        
        .menu-toggle.active .hamburger-lines span:nth-child(1) {
            transform: rotate(45deg) translate(7px, 7px);
        }
        
        .menu-toggle.active .hamburger-lines span:nth-child(2) {
            opacity: 0;
        }
        
        .menu-toggle.active .hamburger-lines span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
        
        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }
            
            .nav-menu {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                background: var(--white);
                flex-direction: column;
                padding: 30px 20px;
                box-shadow: 8px 8px 0px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                z-index: 999;
                border-bottom: 4px solid var(--primary-color);
                gap: 0;
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 0;
                padding: 0;
                width: 100%;
            }
            
            .nav-menu a {
                display: block;
                padding: 15px 20px;
                margin: 5px 0;
                background: var(--bg-color);
                border: 3px solid var(--primary-color);
                box-shadow: 4px 4px 0px var(--accent-color);
                transform: rotate(-0.5deg);
                text-align: center;
                font-size: 1rem;
                font-weight: 700;
                color: var(--primary-color);
                text-decoration: none;
                transition: all 0.3s ease;
            }
            
            .nav-menu a:hover {
                background: var(--secondary-color);
                color: var(--white);
                transform: rotate(0.5deg) scale(1.02);
                box-shadow: 6px 6px 0px var(--accent-color);
            }
            
            .nav-menu li:nth-child(even) a {
                transform: rotate(0.5deg);
            }
            
            .nav-menu li:nth-child(even) a:hover {
                transform: rotate(-0.5deg) scale(1.02);
            }
        }
    `;
    document.head.appendChild(hamburgerStyle);
    
    navContainer.appendChild(menuToggle);
    
    // 菜单切换功能
    let isMenuOpen = false;
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        
        this.classList.toggle('active', isMenuOpen);
        navMenu.classList.toggle('active', isMenuOpen);
        
        // 粗犷风格动画
        this.style.transform = isMenuOpen ? 'rotate(5deg) scale(1.1)' : 'rotate(-2deg) scale(1)';
        this.style.background = isMenuOpen ? 'var(--secondary-color)' : 'var(--white)';
    });
    
    // 点击菜单项关闭菜单
    navMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.style.transform = 'rotate(-2deg) scale(1)';
            menuToggle.style.background = 'var(--white)';
        }
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navContainer.contains(e.target)) {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.style.transform = 'rotate(-2deg) scale(1)';
            menuToggle.style.background = 'var(--white)';
        }
    });
    
    // 窗口大小变化时处理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.style.transform = 'rotate(-2deg) scale(1)';
            menuToggle.style.background = 'var(--white)';
        }
    });
}

// 图片画廊
function initImageGallery() {
    const screenshotItems = document.querySelectorAll('.screenshot-item');
    const clickableImages = document.querySelectorAll('.clickable-image');
    
    // 处理截图项目
    screenshotItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.dataset.imageTitle || img.alt;
            const desc = this.dataset.imageDesc || '';
            if (img) {
                openImageModal(img.src, title, desc);
            }
        });
        
        // 添加粗犷的悬停效果
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(0deg) scale(1.05)';
            this.style.zIndex = '10';
            this.style.filter = 'drop-shadow(15px 15px 0px rgba(0,0,0,0.2))';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
            this.style.filter = '';
        });
    });
    
    // 处理可点击图片
    clickableImages.forEach(img => {
        img.addEventListener('click', function() {
            const container = this.closest('[data-image-title]');
            const title = container?.dataset.imageTitle || this.alt;
            const desc = container?.dataset.imageDesc || '';
            openImageModal(this.src, title, desc);
        });
    });
}

// 增强的图片模态框
function openImageModal(src, title, description) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        overflow: auto;
        padding: 20px;
    `;
    
    // 创建图片容器
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        position: relative;
        max-width: 95vw;
        max-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border: 6px solid #ffffff;
        box-shadow: 20px 20px 0px #e74c3c;
        transform: rotate(-1deg);
        transition: all 0.3s ease;
        cursor: zoom-in;
    `;
    
    // 创建信息面板
    const infoPanel = document.createElement('div');
    infoPanel.style.cssText = `
        background: rgba(255,255,255,0.95);
        color: #2c3e50;
        padding: 20px;
        margin-top: 20px;
        border: 4px solid #2c3e50;
        box-shadow: 8px 8px 0px #f39c12;
        transform: rotate(0.5deg);
        max-width: 600px;
        text-align: center;
    `;
    
    infoPanel.innerHTML = `
        <h3 style="margin: 0 0 10px 0; font-size: 1.5rem; font-weight: 900; color: #e74c3c; text-shadow: 2px 2px 0px #f39c12;">${title}</h3>
        <p style="margin: 0; line-height: 1.6; font-size: 1rem;">${description}</p>
    `;
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 30px;
        right: 30px;
        background: #e74c3c;
        color: white;
        border: 3px solid #2c3e50;
        font-size: 1.8rem;
        width: 60px;
        height: 60px;
        cursor: pointer;
        transform: rotate(-5deg);
        box-shadow: 6px 6px 0px #2c3e50;
        border-radius: 50%;
        transition: all 0.3s ease;
        z-index: 10001;
    `;
    
    // 创建缩放提示
    const zoomHint = document.createElement('div');
    zoomHint.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        border: 2px solid #f39c12;
        animation: fadeInOut 3s ease-in-out infinite;
    `;
    // 根据设备类型设置提示文字
    const isMobileDevice = window.innerWidth <= 768;
    zoomHint.innerHTML = isMobileDevice 
        ? '👆 双击缩放 | 双指缩放 | 点击空白处关闭'
        : '🔍 滚轮缩放 | ESC键关闭 | 点击空白处关闭';
    
    imageContainer.appendChild(img);
    modal.appendChild(imageContainer);
    modal.appendChild(infoPanel);
    modal.appendChild(closeBtn);
    modal.appendChild(zoomHint);
    document.body.appendChild(modal);
    
    // 图片缩放和拖拽功能
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let lastTouchDistance = 0;
    let isMobile = window.innerWidth <= 768;
    
    // 桌面端滚轮缩放
    if (!isMobile) {
        img.addEventListener('wheel', function(e) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            scale *= delta;
            scale = Math.min(Math.max(0.5, scale), 3);
            
            img.style.transform = `rotate(-1deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
        });
    }
    
    // 移动端双击缩放
    let lastTap = 0;
    img.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
            if (scale === 1) {
                scale = 2;
            } else {
                scale = 1;
                translateX = 0;
                translateY = 0;
            }
            img.style.transform = `rotate(-1deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
        lastTap = currentTime;
    });
    
    // 移动端双指缩放
    img.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            lastTouchDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        } else if (e.touches.length === 1 && scale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    });
    
    img.addEventListener('touchmove', function(e) {
        e.preventDefault();
        
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            if (lastTouchDistance > 0) {
                const delta = currentDistance / lastTouchDistance;
                scale *= delta;
                scale = Math.min(Math.max(0.5, scale), 3);
                img.style.transform = `rotate(-1deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            }
            lastTouchDistance = currentDistance;
        } else if (e.touches.length === 1 && isDragging && scale > 1) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            img.style.transform = `rotate(-1deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    });
    
    img.addEventListener('touchend', function() {
        isDragging = false;
        lastTouchDistance = 0;
    });
    
    // 桌面端鼠标拖拽
    img.addEventListener('mousedown', function(e) {
        if (scale > 1 && !isMobile) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            img.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging && !isMobile) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            img.style.transform = `rotate(-1deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (!isMobile) {
            isDragging = false;
            img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
        }
    });
    
    // 动画进入
    modal.style.opacity = '0';
    imageContainer.style.transform = 'scale(0.5) rotate(-10deg)';
    infoPanel.style.transform = 'rotate(0.5deg) translateY(50px)';
    
    setTimeout(() => {
        modal.style.opacity = '1';
        imageContainer.style.transform = 'scale(1) rotate(0deg)';
        infoPanel.style.transform = 'rotate(0.5deg) translateY(0)';
    }, 10);
    
    // 关闭功能
    const closeModal = () => {
        modal.style.opacity = '0';
        imageContainer.style.transform = 'scale(0.5) rotate(-10deg)';
        infoPanel.style.transform = 'rotate(0.5deg) translateY(50px)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    // 事件监听
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    closeBtn.addEventListener('click', closeModal);
    
    // ESC键关闭
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
    
    // 阻止图片和信息面板点击关闭
    imageContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    infoPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// 粗犷毛边特效增强
function addRoughEffects() {
    // 为按钮添加随机旋转
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn, index) => {
        const randomRotation = (Math.random() - 0.5) * 3; // -1.5 到 1.5 度
        btn.style.transform = `rotate(${randomRotation}deg)`;
        
        btn.addEventListener('mouseenter', function() {
            const hoverRotation = (Math.random() - 0.5) * 4;
            this.style.transform = `rotate(${hoverRotation}deg) translate(-3px, -3px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = `rotate(${randomRotation}deg)`;
        });
    });
    
    // 为卡片添加随机倾斜
    const cards = document.querySelectorAll('.feature-card, .tech-item, .contact-item');
    cards.forEach(card => {
        const randomRotation = (Math.random() - 0.5) * 2;
        card.style.transform += ` rotate(${randomRotation}deg)`;
    });
}

// 页面加载完成后添加特效
window.addEventListener('load', () => {
    addRoughEffects();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 鼠标跟随效果（可选）
function initMouseTrail() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 创建鼠标跟随元素
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: #e74c3c;
        border: 2px solid #2c3e50;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: rotate(-45deg);
        opacity: 0.7;
        transition: all 0.1s ease;
    `;
    
    document.body.appendChild(trail);
    
    setInterval(() => {
        trail.style.left = mouseX - 10 + 'px';
        trail.style.top = mouseY - 10 + 'px';
    }, 100);
}

// 如果需要鼠标跟随效果，取消注释下面这行
// initMouseTrail(); 