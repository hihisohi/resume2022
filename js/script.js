document.addEventListener('DOMContentLoaded', function () {


    ScrollTrigger.matchMedia({

        // large (Pc)
        "(min-width: 960px)": function () {

            // scroll
            const pageContainer = document.querySelector('[data-scroll-container]');
            const scroller = new LocomotiveScroll({
                el: pageContainer,
                smooth: true
            });

            scroller.on('scroll', ScrollTrigger.update);

            ScrollTrigger.scrollerProxy(pageContainer, {
                scrollTop(value) {
                    return arguments.length ?
                        scroller.scrollTo(value, 0, 0) :
                        scroller.scroll.instance.scroll.y;
                },
                getBoundingClientRect() {
                    return {
                        left: 0,
                        top: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                },
                pinType: pageContainer.style.transform ? 'transform' : 'fixed'
            });


            // pin section & horizental scroll
            let pinWrap = document.querySelector('.pin-wrap');
            let pinWrapWidth = pinWrap.offsetWidth;
            let horizontalScrollLength = pinWrapWidth - window.innerWidth;

            gsap.to('.pin-wrap', {
                scrollTrigger: {
                    scroller: pageContainer,
                    scrub: true,
                    trigger: '.section-pin',
                    pin: true,
                    // anticipatePin: 1,
                    start: '50% 50%',
                    end: pinWrapWidth
                },
                x: -horizontalScrollLength,
                ease: 'none'
            });
            ScrollTrigger.addEventListener('refresh', () => scroller.update());
            ScrollTrigger.refresh();


            // menu click
            const gnbA = gnb.querySelectorAll('a');
            
            gnbA.forEach(function (ele, idx) {
                ele.addEventListener('click', function (e) {
                    e.preventDefault();
                    scroller.scrollTo(document.querySelector(ele.getAttribute('href')));
                });
            });



            // main - index circle
            let indexCircle = document.querySelector('.index-circle');
            let skillSectHei = document.querySelector('.section__skills').offsetHeight;
            let skillSecWid = document.querySelector('.section__skills').offsetWidth;

            gsap.to(indexCircle, {
                scrollTrigger: {
                    scroller: pageContainer,
                    trigger: '.section__skills',
                    start: '30% bottom',
                    end: skillSecWid,
                    scrub: 0.1,
                    onLeave: () => circleHide(),
                    onEnterBack: () => circleShow(),
                    // markers: true
                },
                ease: 'none',
                scale: 10,
            });

            function circleHide() {
                indexCircle.style.display = 'none';
            }

            function circleShow() {
                indexCircle.style.display = 'block';
            }



            // main - background color change
            let body = document.body;
            let expSectHei = document.querySelector('.section__experience').offsetHeight;

            gsap.to(body, {
                scrollTrigger: {
                    scroller: pageContainer,
                    trigger: '.section__skills',
                    start: '80% bottom',
                    end: skillSectHei,
                    onEnter: () => bgChange('white'),
                    onLeaveBack: () => bgChange('origin'),
                }
            });

            gsap.to(body, {
                scrollTrigger: {
                    scroller: pageContainer,
                    trigger: '.section__experience',
                    start: 'top 50%',
                    end: '+=' + expSectHei,
                    onEnter: () => bgChange('black'),
                    onLeaveBack: () => bgChange('white'),
                    onLeave: () => bgChange('origin'),
                    onEnterBack: () => bgChange('black'),
                    // markers: true
                }
            });

            function bgChange(color) {
                let bgColor, fontColor, menuColor;

                switch (color) {
                    case 'origin':
                        bgColor = '#f0f0f2';
                        fontColor = '#333';
                        menuColor = '#333';
                        break;
                    case 'black':
                        bgColor = '#1e1e1e';
                        fontColor = '#f0f0f2';
                        menuColor = '#f0f0f2';
                        break;
                    case 'white':
                        bgColor = '#fff';
                        fontColor = '#333';
                        menuColor = '#333';
                        break;
                }

                if (menu.classList.contains('open')) {
                    menuColor = '#f0f0f2';
                }

                document.body.style.backgroundColor = bgColor;
                document.body.style.color = fontColor;
                document.querySelectorAll('.hamburger span').forEach(function (ele, idx) {
                    ele.style.backgroundColor = menuColor;
                });
                document.querySelector('.verti-line').style.backgroundColor = menuColor;

            }




            // main - about section : back circle size & position
            const aboutThings = document.querySelectorAll('.about-things li');

            aboutThings.forEach(function (ele, idx) {
                const aboutText = ele.children[1].innerHTML;
                var textLeng = aboutText.length;

                ele.style.top = ele.dataset.postop + '%';
                ele.style.left = ele.dataset.posleft + '%';
                ele.children[0].style.opacity = (idx + 1) * 0.03;
                ele.children[1].style.transform = 'rotate(' + (5 + idx * 10 * ((-1) ** idx)) + 'deg)';

                let su;
                if (textLeng < 10) {
                    su = 2.5;
                } else if (textLeng > 30) {
                    su = .6;
                } else {
                    su = .9;
                }
                ele.children[0].style.width = textLeng * su + 'rem';
                ele.children[0].style.height = textLeng * su + 'rem';

            });



            // cursor
            function lerp(start, end, amount) {
                return (1 - amount) * start + amount * end
            }

            const cursor = document.createElement('div');
            cursor.className = 'cursor';

            const cursorBd = document.createElement('div');
            cursorBd.className = 'cursor-bd';
            let cursorX = 0;
            let cursorY = 0;
            let pageX = 0;
            let pageY = 0;
            let size = 8;
            let sizeBd = 36;
            let followSpeed = .16;

            document.body.appendChild(cursor);
            document.body.appendChild(cursorBd);

            if ('ontouchstart' in window) {
                cursor.style.display = 'none';
                cursorBd.style.display = 'none';
            }

            cursor.style.setProperty('--size', size + 'px');
            cursorBd.style.setProperty('--size', sizeBd + 'px');

            window.addEventListener('mousemove', function (e) {
                pageX = e.clientX;
                pageY = e.clientY;
                cursor.style.left = e.clientX - size / 2 + 'px';
                cursor.style.top = e.clientY - size / 2 + 'px';
            });

            function loop() {
                cursorX = lerp(cursorX, pageX, followSpeed);
                cursorY = lerp(cursorY, pageY, followSpeed);
                cursorBd.style.top = cursorY - sizeBd / 2 + 'px';
                cursorBd.style.left = cursorX - sizeBd / 2 + 'px';
                requestAnimationFrame(loop);
            }

            loop();

            let startY;
            let endY;
            let clicked = false;

            function mousedown(e) {
                gsap.to(cursor, {
                    scale: 4.5
                });
                gsap.to(cursorBd, {
                    scale: .4
                });

                clicked = true;
                startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
            }

            function mouseup(e) {
                gsap.to(cursor, {
                    scale: 1
                });
                gsap.to(cursorBd, {
                    scale: 1
                });

                endY = e.clientY || endY;
                if (clicked && startY && Math.abs(startY - endY) >= 40) {
                    clicked = false;
                    startY = null;
                    endY = null;
                }
            }
            window.addEventListener('mousedown', mousedown, false);
            window.addEventListener('touchstart', mousedown, false);
            window.addEventListener('touchmove', function (e) {
                if (clicked) {
                    endY = e.touches[0].clientY || e.targetTouches[0].clientY;
                }
            }, false);
            window.addEventListener('touchend', mouseup, false);
            window.addEventListener('mouseup', mouseup, false);


            function mouseEnterA(e) {
                gsap.to(cursor, {
                    scale: 2,
                    backgroundColor: '#0CD6BD'
                });
                gsap.to(cursorBd, {
                    scale: 0.2,
                    opacity: 0
                });
            }

            function mouseLeaveA(e) {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: '#fff'
                });
                gsap.to(cursorBd, {
                    scale: 1,
                    opacity: .5
                });
            }

            const eleA = document.querySelectorAll('a');
            eleA.forEach(function (ele, idx) {
                ele.addEventListener('mouseenter', mouseEnterA, false);
                ele.addEventListener('mouseleave', mouseLeaveA, false);
            });





        },




        // medium (Tablet & Moblie)
        "(min-width: 600px) and (max-width: 959px)": function () {
            // The ScrollTriggers created inside these functions are segregated and get
            // reverted/killed when the media query doesn't match anymore. 
        },




        // small
        "(max-width: 599px)": function () {
            // The ScrollTriggers created inside these functions are segregated and get
            // reverted/killed when the media query doesn't match anymore. 
        },




        // all 
        "all": function () {
            // ScrollTriggers created here aren't associated with a particular media query,
            // so they persist.


            // menu
            const wrapper = document.querySelector('.wrapper');
            const menu = document.querySelector('#menu');
            const hamburger = document.querySelector('.hamburger');
            const gnb = document.querySelector('#gnb');


            hamburger.addEventListener('click', function () {
                if (!menu.classList.contains('open')) {
                    menuOpen();
                } else {
                    menuClose();
                }
            });

            wrapper.addEventListener('click', function () {
                if (menu.classList.contains('open')) {
                    menuClose();
                }
            });

            function menuOpen() {
                menu.classList.add('open');
                gsap.to(gnb, {
                    x: '0',
                    opacity: 1,
                    duration: .8,
                    ease: Expo.easeOut,
                });

                document.querySelectorAll('.hamburger span').forEach(function (ele, idx) {
                    ele.style.backgroundColor = '#f0f0f2';
                });
                document.querySelector('.verti-line').style.backgroundColor = '#f0f0f2';
            }

            function menuClose() {
                menu.classList.remove('open');
                gsap.to(gnb, {
                    x: '100%',
                    opacity: 0,
                    duration: .8,
                    ease: Expo.easeOut,
                });

                if (document.body.style.backgroundColor != 'rgb(30, 30, 30)') {
                    document.querySelectorAll('.hamburger span').forEach(function (ele, idx) {
                        ele.style.backgroundColor = '#333';
                    });
                    document.querySelector('.verti-line').style.backgroundColor = '#333';
                }
            }




            // main - intro text animation
            const introTxt = document.querySelectorAll('.intro-title span');
            introTxt.forEach(function (ele, idx) {
                let arr = ele.innerHTML.split('');
                ele.innerHTML = "";
        
                arr.forEach(function (ele2, idx2) {
                    const innerSpan = document.createElement('span');
                    innerSpan.className = 'span0' + (idx2 + 1);
                    innerSpan.innerHTML = ele2;
                    ele.appendChild(innerSpan);
        
                    innerSpan.style.animationDelay = idx + idx2 * 0.1 + 's';
        
                });
        
            });





        }

    });







    







    // main - intro photo slide
    const photoSrc = document.querySelector('.photo-img').getAttribute('xlink:href');
    let str = photoSrc.substring(photoSrc.lastIndexOf('_') + 1, photoSrc.lastIndexOf('.'));
    let num = parseInt(str);
    const maxImgIdx = 8;

    function photoSlide(imgIdx) {
        num++;
        if (num > imgIdx) {
            num = 1;
        }

        if (num < 10) {
            str = '0' + num;
        } else {
            str = num;
        }
        str = photoSrc.replace(photoSrc.substring(photoSrc.lastIndexOf('_') + 1, photoSrc.lastIndexOf('.')), str);
        document.querySelector('.photo-img').setAttribute('xlink:href', str);
    }
    setInterval(function () {
        photoSlide(maxImgIdx)
    }, 2500);

    const introCircle = document.querySelector('.intro-circle');
    const svgBgCircle = document.querySelector('.svg-bg-circle');
    const photoShape = document.querySelector('.photo-shape');

    let introCircleCenter = {
        x: document.querySelector('.intro-circle').offsetLeft,
        y: document.querySelector('.intro-circle').offsetTop
    };

    console.log('중심' + introCircleCenter.x, introCircleCenter.y);

    introCircle.addEventListener('mouseenter', function (e) {
        let posX = introCircleCenter.x - e.clientX;
        let posY = introCircleCenter.y - e.clientY;

        gsap.to(photoShape, 2, {
            scale: 1.02,
            rotate: Math.atan2(posY, posX),
            opacity: .7,
            ease: Elastic.easeOut.config(1.2, 0.5)
        });

        gsap.to(svgBgCircle, 2, {
            x: posX / 12,
            y: posY / 10,
            ease: Elastic.easeOut.config(1.2, 0.7)
        });
    });

    introCircle.addEventListener('mouseleave', function () {
        gsap.to(photoShape, 2, {
            scale: 1,
            rotate: 0,
            opacity: .6,
            ease: Elastic.easeOut.config(1.2, 0.5)
        });

        gsap.to(svgBgCircle, 2, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut.config(1.2, 0.7)
        });
    });





    // main - skill section : slide & mousehover effect
    var swiper2 = new Swiper('.skill-icons', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        grabCursor: true,
        autoplay: {
            delay: 1500,
            disableOnInteraction: false,
        },
        speed: 800,
        loop: true
    });

    const skillBox = document.querySelectorAll('.skill-box');
    skillBox.forEach(function (ele, idx) {
        ele.addEventListener('mouseenter', function () {
            ele.children[0].children[1].children[0].style.opacity = 0;
            ele.children[0].children[1].children[1].style.opacity = 1;
        });
        ele.addEventListener('mouseleave', function () {
            ele.children[0].children[1].children[0].style.opacity = 1;
            ele.children[0].children[1].children[1].style.opacity = 0;
        });
    });



});