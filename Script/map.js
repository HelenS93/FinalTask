var MapGoogle = {
    map: null,
    geo: null,
    initData: {zoom: 12, lat: 0.0, lng: 0.0},
    initSingle: function (mapId, initData) {
        var address = initData.address;
        var mapOptions = {
            zoom: parseInt(this.initData.zoom),
            center: new google.maps.LatLng(parseFloat(this.initData.lat), parseFloat(this.initData.lng)),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById(mapId), mapOptions);
        this.geocode(address);
    },
    geocode: function (address) {
        var geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({address: address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
            		MapGoogle.geo = results[0].geometry.location;
                MapGoogle.map.setCenter(MapGoogle.geo);
            } else {
                alert('address error');
                $('#modalMap').modal('hide');
            }
        });
    }
}
