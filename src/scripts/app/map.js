(function () {
    ymaps.ready(init);
    let map;
    let place;
    
    function init() {
        map = new ymaps.Map("map", {
            center: [52.10205756, 23.69707825],
            zoom: 16,
            controls: []
        },{
            suppressMapOpenBlock: true,
            suppressObsoleteBrowserNotifier: true
        });
        place = new ymaps.Placemark([52.10174257, 23.69881500], {
            hintContent: 'офис СЗАО "Трансинформ"'
        });
        
        map.geoObjects.add(place);
    }
})();

