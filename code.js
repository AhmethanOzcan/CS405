const data = [
    {"year":2022 ,"female_suicide":1035 ,"male_suicide":3111 ,"total_suicide":4146},
    {"year":2021 ,"female_suicide":931 ,"male_suicide":3263 ,"total_suicide":4194},
    {"year":2020 ,"female_suicide":865 ,"male_suicide":2845 ,"total_suicide":3710},
    {"year":2019 ,"female_suicide":792 ,"male_suicide":2684 ,"total_suicide":3476},
    {"year":2018 ,"female_suicide":813 ,"male_suicide":2529 ,"total_suicide":3342},
    {"year":2017 ,"female_suicide":723 ,"male_suicide":2445 ,"total_suicide":3168},
    {"year":2016 ,"female_suicide":767 ,"male_suicide":2426 ,"total_suicide":3193},
    {"year":2015 ,"female_suicide":888 ,"male_suicide":2358 ,"total_suicide":3246},
    {"year":2014 ,"female_suicide":817 ,"male_suicide":2352 ,"total_suicide":3169},
    {"year":2013 ,"female_suicide":870 ,"male_suicide":2382 ,"total_suicide":3252}
]

var styles = `
    h1 {
        font: 24px sans-serif;
    }
    .barf {
        fill: #7FFFD4;
    }
    .barm {
        fill: #FFFF8F;
    }
    .bar {
        fill: #d81c3f;
    }
    .barm:hover {
        fill: darkgray;
    }
    .barf:hover {
        fill: darkgray;
    }
    .bar:hover {
        fill: darkgray;
    }
    
    .axis {
        font: 10px sans-serif;
    }
    
    .axis path,
    .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }
`



const increasingYears = data.reverse()

var html    =   '<h1>SVG Vertical Bar Chart </h1>' +
                    '<svg width="1200" height="1000">' +
                        '<g transform="translate(40,20)">'
var xAxis   =   '<g class="x axis" transform="translate(0,900)">'
var yAxis   =   '<g class="y axis" >'
var bars    =   ''      

for(let i = 0; i < increasingYears.length; i++)
{
    //---------------------------------------------------------------------------------------------------------
    //X ekseni için hesaplamalar:
        //ilk tick = 56.5
        //her bar  = 31
        //bar grupları arası = 3
        //2 tick arası 96
    const transX = 56.5 + (96.0*i)
    xAxis +=    `<g class="tick" transform="translate(${transX},0)" style="opacity: 1;"><line y2="6" x2="0"></line>` +
                    `<text dy=".71em" y="9" x="0" style="text-anchor: middle;">${increasingYears[i].year}</text>` +
                `</g>`
    //---------------------------------------------------------------------------------------------------------
        
    
    //---------------------------------------------------------------------------------------------------------
    positionStart = 10 + (96*i)
    bars +=     `<rect class="barf" x="${positionStart}" width="31" y="${900-(increasingYears[i].female_suicide/5)}" height="${increasingYears[i].female_suicide/5}"></rect>`
    bars +=     `<rect class="barm" x="${positionStart+31}" width="31" y="${900-(increasingYears[i].male_suicide/5)}" height="${increasingYears[i].male_suicide/5}"></rect>`
    bars +=     `<rect class="bar" x="${positionStart+62}" width="31" y="${900-(increasingYears[i].total_suicide/5)}" height="${increasingYears[i].total_suicide/5}"></rect>`
    //---------------------------------------------------------------------------------------------------------

};                 



//---------------------------------------------------------------------------------------------------------
    //Y ekseni için hesaplamalar
        //En üst noktayı 900 al

        for(let i=0; i<=4500; i+=250)
        {
            yAxis +=    `<g class="tick" transform="translate(0,${900-i/5})" style="opacity: 1;"><line x2="-6" y2="0"></line>` +
                            `<text dy=".32em" x="-9" y="0" style="text-anchor: end;">${i}</text>` +
                        `</g>`
        }

    //---------------------------------------------------------------------------------------------------------

xAxis +=        '<path class="domain" d="M0,6V0H487V6"></path>' + //M0,6V0H975V6 for full line but this seems cooler
                '<text y="0" x="1000" dy=".71em" style="text-anchor: end;">Years</text>' +
            '</g>'
        
yAxis +=        '<path class="domain" d="M-6,0H0V450H-6"></path>' + //M-6,0H0V900H-6 for full line but this seems cooler
                '<text transform="rotate(-90)" y="6" dy=".71em" style="text-anchor: end;">Suicides of Female/Male/Total</text>' +
            '</g>'
                    
var html_X      =   html        +   xAxis
var html_X_Y    =   html_X      +   yAxis
var html_X_Y_B  =   html_X_Y    +   bars
var html_END    =   html_X_Y_B  +   '</g>' + '</svg>'

document.write(html_END)
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)