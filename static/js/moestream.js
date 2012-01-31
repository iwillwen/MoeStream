$(function () {
    var $container = $('#container');
    var $upload_box = $('#upload_box');
    var $upload = $('#upload');
    var socket = io.connect();
    socket.on('push', function (data) {
        addItem(data);
    });
    $upload_box[0].addEventListener("dragenter", dragEnter, true);
    $upload_box[0].addEventListener("dragexit", dragExit, true);
    $upload_box[0].addEventListener("dragover", dragOver, true);
    $upload_box[0].addEventListener("drop", drop, true);
    $('#file')[0].addEventListener("change", function (evt) {
        $(this).parent().parent().css({ background: '#888' });
        $('input[type=text]').hide();
        $('.progress-bar').show();
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.onloadend = handleReaderLoadEnd;
        reader.readAsDataURL(file);
        $('#se')[0].reset();
    }, true);
    $('.progress-bar').hide();
    $upload.toggle(function (evt) {
        $upload_box.css({
            top: '-15px'
        }, 1000);
    }, function (evt) {
        $upload_box.css({
            top: '-500px'
        }, 1000);
    });
    $('#url').keypress(function (evt) {
        if (evt.keyCode !== 13) return true;
        $.post('/addPic', {
            url: $(this).val()
        }, function () {
            $upload_box.animate({
                top: '-500px'
            }, 1000);
            $upload_box.css("background", '#F1F1F1');
        });
    });
    $('#close_box').click(function (evt) {
        $upload_box.css({
            top: '-500px'
        });
    });
    $container.masonry({
        itemSelector: '.item',
        columnWidth: 200,
        isAnimated: true
    });
    $container.imagesLoaded(function(){
        $container.masonry({
            itemSelector : '.item'
        });
    });
    function addItem (html) {
        var $boxes = $(html);
        $container.prepend( $boxes );
        setTimeout(function () {
            $container.masonry('reload');
        }, 500);
    }
    function dragEnter(evt) {
        $(this).css({ background: '#888' });
        $('input[type=text]').hide();
        $('.progress-bar').show();
        evt.stopPropagation();
        evt.preventDefault();
    }
    function dragExit(evt) {
        $(this).css({ background: '#F1F1F1' });
        $('.progress-bar').hide();
        $('input[type=text]').show();
        evt.stopPropagation();
        evt.preventDefault();
    }
    function dragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    function drop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        var count = files.length;
        if (count > 0)
            handleFiles(files);
    }
    function handleFiles(files) {
        var file = files[0];
        var reader = new FileReader();
        reader.onloadend = handleReaderLoadEnd;
        reader.readAsDataURL(file);
    }
    function upload_progress () {
        var xhr = jQuery.ajaxSettings.xhr();
        xhr.upload.onprogress = function (evt) {
            var ratio = evt.loaded / evt.total;
            $('.progress-bar span').css('width', ratio * 100 + '%');
        };
        return xhr;
    }
    function handleReaderLoadEnd(evt) {
        $.ajax({
            url: "/addPic",
            type: "POST",
            data: {
                pic:  evt.target.result
            },
            xhr: upload_progress,
            success: function (msg) {
                $('.progress-bar').find('span').css('width', '0%').end().hide();
                $('input[type=text]').show();
                $upload_box.animate({
                    top: '-500px'
                }, 1000);
                $upload_box.css("background", '#F1F1F1');
            }
        });
    }
});
