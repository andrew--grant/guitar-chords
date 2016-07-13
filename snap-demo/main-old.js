
window.onload = function () {

    var s = Snap('#svg');
    var circle_1 = s.circle(300, 200, 140);
    var circle_2 = s.circle(250, 200, 140);

    // Group circles together

    var circles = s.group(circle_1, circle_2);

    var ellipse = s.ellipse(275, 220, 170, 90);

    // Add fill color and opacity to circle and apply
    // the mask
    circles.attr({
        fill: 'coral',
        fillOpacity: .6,
        mask: ellipse
    });

    ellipse.attr({
        fill: '#fff',
        opacity: .8
    });

    // Create a blink effect by modifying the rx value
    // for ellipse from 90px to 1px and backwards

    function blink() {
        // attrs, duration, easing, callback
        // ellipse.animate({ ry: 180 },500, function () {
        //     ellipse.animate({ ry: 140 }, 500);
        // });

         ellipse.animate({ fill: '#222', transform:'translate(30,100)'},500, function () {
             ellipse.animate({ fill: '#fff', transform:'translate(275,220)' }, 500);
        });
    };

    // Recall blink method once every 3 seconds

    setInterval(blink, 2000);

}
