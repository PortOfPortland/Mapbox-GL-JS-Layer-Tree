'use strict';

//@implements {IControl}
class LayerTree {

    //@param {Object} [options]
    constructor(options) {
        this.options = options;
        this.collection = [];
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

        //layer manager bounding box
        var layerBox = document.createElement('button');
        layerBox.className = 'mapboxgl-ctrl legend-container';

        //legend ui
        var legendDiv = document.createElement('div');
        legendDiv.id = 'mapboxgl-legend';

        layerBox.appendChild(legendDiv);
        this._container.appendChild(layerBox);

        this.getLayers(this._map, this.options.layers, this.collection, this.appendLayerToLegend);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

}

//get layers once they start loading
LayerTree.prototype.getLayers = function(map, layers, collection, callback) {
    map.on('sourcedataloading', function(e) {
        var lyr = layers.filter(function( layer ) {
          return layer.source === e.sourceId;
        });

        if (lyr[0]) {
            var mapLyrObj = map.getSource(e.sourceId);
            collection.push(mapLyrObj);
            callback(mapLyrObj, lyr[0])
        }
    });
}

//callback to append layer to legend
LayerTree.prototype.appendLayerToLegend = function(mapLyrObj, lyr) {
    var legendId = '#mapboxgl-legend';

    var directoryName = lyr.directory;
    var directoryId = directoryName.toLowerCase()

    var layerName = lyr.source;
    var layerId = layerName.toLowerCase();
    var layerDiv = "<div id='" + layerId + "' class='layer-item'>" + layerName + "</div>";

    if ($('#'+directoryId).length) {
        $('#'+directoryId).append(layerDiv);
    } else {
        $(legendId).append("<div id='"+ directoryId + "' class='layer-directory'><div class='directory-name'>" + directoryName + "</div></div>")
        $('#'+directoryId).append(layerDiv);
    }
}


