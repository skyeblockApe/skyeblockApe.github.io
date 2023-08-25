//random backgroun-color
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setRandomBackgroundColor(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const randomColor = getRandomColor();
        element.style.backgroundColor = randomColor;
        element.style.opacity = 1;
        element.style.borderStyle = "solid";
    }
}

// 確保 DOM 加載完成後再執行 JavaScript

document.addEventListener("DOMContentLoaded", function () {
    const ids = []
    ids.forEach(id => setRandomBackgroundColor(id));
});

//random backgroun-color

// 獲取 #top_border 元素
let lastScrollPosition = 0;

window.addEventListener('scroll', function () {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > lastScrollPosition) {
        // 向下滾動，top 逐漸減少至 -10vh
        document.getElementById('top_border').style.top = Math.max(-34, -currentScrollPosition / 10) + 'vh';
    } else {
        // 向上滾動，快速恢復至 0vh
        document.getElementById('top_border').style.top = '0vh';
    }

    lastScrollPosition = currentScrollPosition;
});

const apeproducts = [
    {
        src: "./images/DAVIE/item_1.png"
    },
    {
        src: "./images/DAVIE/item_2.png"
    },
    {
        src: "./images/DAVIE/APE3.png"
    },
    {
        src: "./images/DAVIE/item_6.png"
    },
    {
        src: "./images/DAVIE/APE1.png"
    },
    {
        src: "./images/DAVIE/item_1.png"
    },
    {
        src: "./images/DAVIE/APE2.png"
    },


]

const CFmerchandises = [
    {
        src: "./images/DAVIE/l_item1.png"
    },
    {
        src: "./images/DAVIE/l_item2.png"
    },
    {
        src: "./images/DAVIE/l_item3.png"
    },
]

document.addEventListener("DOMContentLoaded", function () {
    const tp1 = document.getElementById("tp1");
    const tp2 = document.getElementById("tp2");
    // 檢查是否找到了 tp2 元素
    if (tp2) {
        tp1.style.backgroundImage = `url(${apeproducts[0].src})`;
        tp2.style.backgroundImage = `url(${apeproducts[1].src})`;


        // tp1.addEventListener("mouseover", function () {
        //     tp1.style.backgroundSize = '10%'
        // });

        // tp1.addEventListener("mouseout", function () {
        //     tp1.style.backgroundSize = ''
        // });
    } else {
        console.error("Could not find element with ID.");
    }


    function graduallyChangeBlur(element, time, targetBlur) {
        let currentBlur = element.style.filter ? parseFloat(element.style.filter.replace("blur(", "").replace("px)", "")) : 0;
        const blurStep = Math.abs(targetBlur - currentBlur) / (time * 60);

        const blurInterval = setInterval(() => {
            if ((targetBlur > currentBlur && currentBlur < targetBlur) || (targetBlur < currentBlur && currentBlur > targetBlur)) {
                currentBlur = targetBlur > currentBlur ? Math.min(currentBlur + blurStep, targetBlur) : Math.max(currentBlur - blurStep, targetBlur);
                element.style.filter = `blur(${currentBlur}px)`;
            } else {
                clearInterval(blurInterval);
            }
        }, 1000 / 60);

        // 清除模糊效果的间隔后执行一个回调
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time * 1000);
        });
    }

    let currentImageIndex = 2;
    async function changeImages() {
        currentImageIndex = currentImageIndex % apeproducts.length;

        if (currentImageIndex % 2 == 0) {
            await graduallyChangeBlur(tp1, 0.3, 70);
            tp1.style.backgroundImage = `url(${apeproducts[currentImageIndex].src})`;
            await graduallyChangeBlur(tp1, 1.2, 0);
        } else {
            await graduallyChangeBlur(tp2, 0.3, 70);
            tp2.style.backgroundImage = `url(${apeproducts[currentImageIndex].src})`;
            await graduallyChangeBlur(tp2, 1.2, 0);
        }
        currentImageIndex += 1;
    }

    setInterval(changeImages, 5000); // 每 3 秒切换图片


    const CF_poster = document.getElementById("CF_poster")

    for (let i = 0; i < CFmerchandises.length; i++) {
        const CFmerchandise = CFmerchandises[i]
        const BKUnitElement = document.createElement("div");
        BKUnitElement.classList.add("CFmerchandises_bk");

        const ItemUnitElement = document.createElement("div");
        ItemUnitElement.classList.add("CFmerchandises")
        ItemUnitElement.style.backgroundImage = `url(${CFmerchandise.src})`

        BKUnitElement.appendChild(ItemUnitElement)
        CF_poster.appendChild(BKUnitElement)
    }


});