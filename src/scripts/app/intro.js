(function () {
    // Персонажи, декорации и реквизиты
    
    const introSvg = document.getElementById('city_art');
    const getEl = ((svg) => (el) => svg.getElementById(el))(introSvg);
    
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    
    function chain(fn) {
        return 
        
    }
    
    const back_buildings = getEl('back_buildings');
    const front_buildings = getEl('front_buildings');
    const lake = getEl('lake');
    const bench = getEl('bench');
    const sky = getEl('sky');
    const sun = getEl('sun');
    const horizont = getEl('horizont');
    const railroad_group = getEl('railroad_group');
    const train = getEl('train1');
    
    const treeClone = getEl('clone_tree');
    //treeClone.id = "";
    
    let speedFactor = 1;
    const FPS = 1000 / 60;
    
    let speed = () => FPS * speedFactor;
    
    // 0. подготовка сцены
    
    [
        back_buildings, front_buildings, lake, bench, sky, sun,
        horizont
    ].forEach(item => item.setAttribute("hidden", true));
    
    // Сценарий
    
    // 1. Через секунду после инициализации ДОМа появляется поезд летящий среди деревьев
    
    const [, , introHeight, introWidth] = introSvg.getAttribute('viewBox').split(' ');
    
    function makeForest(node) {
        let forest = [];
        node.setAttribute('transform', 'translate(' + -node.getElementsByTagName('circle')[0].getAttribute('cx') + -node.getBBox().height / 2 + ')');
        for (let i = 0; i < 10; i++) {
            
            const x = getRandomInt(0, introWidth);
            const y = Math.random() > 0.5 ? getRandomInt(490, 540) : getRandomInt(570, 700);
            const scale = Math.floor((y / 80 - 5.7) * 100) / 100;
            const iniTransform = `translate(${x} ${y}) scale(${scale})`;
            
            const tree = {
                node: node.cloneNode(true),
                moveX: 0,
                x, y, scale, iniTransform
            };
            
            tree.node.setAttribute('transform', tree.iniTransform);
            forest.push(tree);
        }
        
        forest = forest.sort((a, b) => a.scale - b.scale);
        forest.forEach(tree => {
            tree.node.style.opacity = '1';
            introSvg.insertBefore(tree.node, tree.y < 560 ? back_buildings : lake);
        });
        
        return forest;
    }
    
    
    const forest = makeForest(treeClone);
    
    function moveForest(nextAction) {
        let nextActionStarted = false;
        let timer = setTimeout(function move() {
            if (speedFactor > 0.5) {
                speedFactor -= 0.007;
            }
    
            if (!nextActionStarted && speedFactor < 0.6) {
                nextActionStarted = true;
                nextAction();
            }
            
            forest.forEach(tree => {
                tree.moveX -= (speed() * tree.scale);
                if (tree.x + tree.moveX < 0) {
                    tree.moveX = introWidth - tree.x;
                    if (tree.node && speedFactor < 0.5) {
                        introSvg.removeChild(tree.node);
                        tree.node = null;
                    }
                }
                tree.node && tree.node.setAttribute('transform', 'translate(' + tree.moveX + ')' + ' ' + tree.iniTransform);
            });
            if(forest.some(item => item.node)) timer = setTimeout(move, FPS);
        }, FPS);
    }
    
    moveForest(moveTown);
    
    // 2. Начинает замедляться и ныряет в тунель и выныривает из тунеля уже в городе. Где резко останавливается. При
    // этом должна произойти инерционная деформация домов -- пропорционально удаленности от фундамента с последующим
    // восстановлением. Ключевое, что после этого момента двигаться будет только поезд, но не окружение. 
    //Город надо зараннее отнести на размер SVG, а точнее... так что бы он стал на свое место ровно. Это легко отследить по величине translate...  
    
    let townGap = introWidth * 2;
    
    [back_buildings, front_buildings, lake, sky].forEach(item => {
        item.setAttribute('transform', 'translate(' + townGap  + ')');
        item.removeAttribute('hidden');
    });
    
    function moveTown(nextAction) {
        let timer = setTimeout(function move() {
            townGap -= speed();
            [back_buildings, front_buildings, lake, sky].forEach(item => {
                item.setAttribute('transform', 'translate(' + townGap  + ')');
            })
            
            if (townGap > 0) {
                timer = setTimeout(move, FPS)
            } else skewTown();
            //else nextAction();
        }, FPS);
    }
    
    function skewItem(item, skew) {
        return item.setAttribute('transform', `translate(${item.getBBox().x + item.getBBox().width} ${item.getBBox().y + item.getBBox().height}) skewX(${skew}) translate(${-item.getBBox().x - item.getBBox().width} ${-item.getBBox().y - item.getBBox().height})`);
    }
    
    function skewTown() {
        let skew = 0;
        let first = false;
        let second = false;
        let third = false;
        
        let timer = setTimeout(function move() {
            if(!first) {
                skew += 0.2;
                if(skew > 1.8) first = true;
            }
            if(first && !second) {
                skew -= 0.2;
                if(skew < -0.5) second = true;
            }
            if(second && !third) {
                skew += 0.2;
                if(skew > 0) third = true;
            }
            
            [back_buildings, front_buildings].forEach(item => {
                skewItem(item, skew);
                }
            );
    
            if(
                (!first && skew < 2) ||
                (first && !second && skew > -1) || 
                (second && !third && skew < 1)) {
                timer = setTimeout(move, FPS / 2);
            }

            }, FPS / 2);
   
    }
        
        
        
     
    
    
    // 3. Появляется лавочка с товарищем и солнце. Включаются зацикленные анимации: облака, птицы, часы... В это же
    // время включается параллакс
    
    // 4. Начало цикла. Чувак опускает газету, улыбается и подмигивает. Периодичность около 10 сек. 
    
    function recycleTrain() {
        let timer = setTimeout(function move() {
            
        }, FPS);
        
    }
    
    
    // 5. Сразу после этого уезжает поезд, через несколько секунд приезжает следующий, чувак улыбается и поезд уезжает.
    
    

    
})();