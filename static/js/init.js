/**
 * Created by Ludei on 23/05/14.
 * Forked by BathTimeFish
 */

(function () {

    window.wereable = window.wereable || {};

    function createCanvas() {
        // game size
        var size = {sW:420, sH:420 };
        // director
        var director= new CAAT.Director().
            initialize(size.sW,size.sH, document.getElementsByTagName("canvas")[0]).
            setClear(false);

        if ( navigator.isCocoonJS ) {
            director.enableResizeEvents( CAAT.Foundation.Director.RESIZE_STRETCH );
        } else {
            director.enableResizeEvents( CAAT.Foundation.Director.RESIZE_PROPORTIONAL );
        }

        var container = document.getElementById("container");
        var canvas = document.getElementsByTagName("canvas")[0];
        container.style.width = canvas.width + "px";
        container.style.height = canvas.height + "px";

        return director;
    }

    function createHtml5DemoScreen (director , appScene, mainContainer){

        //// container
        var container = new CAAT.Foundation.ActorContainer()
            .setFillStyle('#ffffff')
            .setGlobalAnchor(0,0.5)
            .setScale(1,1)
            .setBounds(0 ,mainContainer.height/2,mainContainer.width/3,mainContainer.height)
            .enableEvents(false);
        mainContainer.addChild(container);

        //// bg images
        var imagesContainer = new CAAT.Foundation.ActorContainer()
            .setGlobalAnchor(0,0.5)
            .setScale(1,1)
            .setFillStyle('#ffffff')
            .setBounds(0,mainContainer.height/2, container.width, container.height)
            .enableEvents(false);
        container.addChild(imagesContainer);

        var createBackgroundImage = function (name){
            return new CAAT.Actor().
                setBackgroundImage( director.getImage(name), false ).
                setGlobalAnchor(0.5,0.5).
                enableEvents(false).
                setSize(imagesContainer.width,imagesContainer.height).
                setLocation(imagesContainer.width * 0.5, imagesContainer.height * 0.5).
                setImageTransformation( CAAT.Foundation.SpriteImage.TR_FIXED_TO_SIZE);
        };

        var bgImags = [];
        bgImags.push(createBackgroundImage("js"));
        bgImags.push(createBackgroundImage("css3"));
        bgImags.push(createBackgroundImage("html5"));

        for(var i = 0; i<bgImags.length; i++){
            imagesContainer.addChild(bgImags[i]);
        }

        var zOrder = 10;
        var currentImageShown = 0;
        var changeImageWithAlpha = function ( bgImags ){
            bgImags[currentImageShown].setAlpha(0);
            imagesContainer.setZOrder(bgImags[currentImageShown],zOrder);
            zOrder++;
            var ab = new CAAT.Behavior.AlphaBehavior().
                setDelayTime(0, 1000).
                setValues(0, 1);
            bgImags[currentImageShown].addBehavior(ab);
            currentImageShown ++;
            if(currentImageShown>=bgImags.length)currentImageShown = 0;
        };

        setInterval(function(){
            changeImageWithAlpha(bgImags)
        }, 4 * 1000);

    }

    function createApp (director) {
        var appScene = director.createScene().setId("wearables.appScene");
        //// container
        var mainContainer = new CAAT.Foundation.ActorContainer()
            .setGlobalAnchor(0,0)
            .setScale(1,1)
            .setBounds(0,0,director.width * 3,director.height)
            .setFillStyle('#00ff00')
            .enableEvents(true);
        appScene.addChild(mainContainer);
        createHtml5DemoScreen(director,appScene,mainContainer);
        //setupSlider(director,mainContainer);
        director.setScene(0);
        CAAT.loop(60);
    }

    function loadImages() {
        //// create director
        var director = createCanvas();
        new CAAT.ImagePreloader().loadImages(
            [
                {id:'html5',        url: 'static/res_tiles/html5.png'},
                {id:'js',           url: 'static/res_tiles/js.png'},
                {id:'css3',         url: 'static/res_tiles/css3.png'}
            ],
            function( counter, images ) {
                if (counter == images.length) {
                    director.setImagesCache(images);
                    createApp(director);
                }
            }
        );
    }

    window.addEventListener('load', loadImages, false);

})();
