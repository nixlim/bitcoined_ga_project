// A $( document ).ready() block.
$(document).ready(function() {


//mobile size menu

var nav = responsiveNav(".nav-collapse", { // Selector
  animate: true, // Boolean: Use CSS3 transitions, true or false
  transition: 400, // Integer: Speed of the transition, in milliseconds
  label: "<h1 class=\"left_corner\" style=\"color: white;\"><i class=\"fa fa-bitcoin fa-spin fa-lg\"></i><span class=\"ir\">B</span>itcoined</h1>", // String: Label for the navigation toggle
  insert: "before", // String: Insert the toggle before or after the navigation
  customToggle: "", // Selector: Specify the ID of a custom toggle
  openPos: "relative", // String: Position of the opened nav, relative or static
  navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
  jsClass: "js", // String: 'JS enabled' class which is added to <html> el
  init: function(){}, // Function: Init callback
  open: function(){}, // Function: Open callback
  close: function(){} // Function: Close callback
});


  // Middle Size Screen menu

  $('#cssmenu > ul > li > a').click(function() {
  $('#cssmenu li').removeClass('active');
  $(this).closest('li').addClass('active'); 
  var checkElement = $(this).next();
  if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
    $(this).closest('li').removeClass('active');
    checkElement.slideUp('normal');
  }
  if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
    $('#cssmenu ul ul:visible').slideUp('normal');
    checkElement.slideDown('normal');
  }
  if($(this).closest('li').find('ul').children().length == 0) {
    return true;
  } else {
    return false; 
  }   
});

   // set up variables for each API connection
   var price24h = "https://blockchain.info/q/24hrprice";
   var bcperblock = "https://blockchain.info/q/bcperblock";
	var difficulty = "https://blockchain.info/q/getdifficulty";
	var currHeight = "https://blockchain.info/q/getblockcount";
	var nextHeight = "https://blockchain.info/q/nextretarget";
	var timeBetweenBlocks = "https://blockchain.info/q/interval";
	var marketcap = "https://blockchain.info/q/marketcap";
	var transactions24h = "https://blockchain.info/q/24hrtransactioncount";
	var volume24h = "https://blockchain.info/q/24hrbtcsent";
	var networkPower = "https://blockchain.info/q/hashrate";

// RESOURCES

//2 decimals

//Math.round(num * 100) / 100


//Numbers with commas
// function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

//Helper function

function numberFormat(number, decimals, dec_point, thousands_sep) {
    // http://kevin.vanzonneveld.net
    // *     example 1: number_format(1234.56);
    // *     returns 1: '1,235'
    // *     example 2: number_format(1234.56, 2, ',', ' ');
    // *     returns 2: '1 234,56'
    // *     example 3: number_format(1234.5678, 2, '.', '');
    // *     returns 3: '1234.57'
    // *     example 4: number_format(67, 2, ',', '.');
    // *     returns 4: '67,00'
    // *     example 5: number_format(1000);
    // *     returns 5: '1,000'
    // *     example 6: number_format(67.311, 2);
    // *     returns 6: '67.31'
    // *     example 7: number_format(1000.55, 1);
    // *     returns 7: '1,000.6'
    // *     example 8: number_format(67000, 5, ',', '.');
    // *     returns 8: '67.000,00000'
    // *     example 9: number_format(0.9, 0);
    // *     returns 9: '1'
    // *    example 10: number_format('1.20', 2);
    // *    returns 10: '1.20'
    // *    example 11: number_format('1.20', 4);
    // *    returns 11: '1.2000'
    // *    example 12: number_format('1.2000', 3);
    // *    returns 12: '1.200'
    var n = !isFinite(+number) ? 0 : +number, 
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
				


// Main function - AJAX protocol connection, using callback to get/process the data
function getValues(url, id, textLabel){

	//This was fun to get working 
$.ajax({
           type: "GET",   //<-http call
           url: url, // 1st ARG
           dataType: "text",
           success: function (data, textStatus) { //anonymous function exec on receipt of data
           
           // Data processing

           //convert to minutes
           	if (url==timeBetweenBlocks) {
           	 data = Math.round(data/60* 100) / 100;

           //Fill the divs - 2nd ARG and 3rd ARG	 
           	 $("#"+id).html(textLabel +"<span class=\"right_text_clr\">" + data+"</span> min");

           	//convert to whole BTCs from satoshis, normalise other values
           	}else if (url==bcperblock || url==volume24h) {
           	 data = Math.round(data/100000000 * 100) / 100;
           	 
           	 $("#"+id).html(textLabel +"<span class=\"right_text_clr\">" + numberFormat(data)+"</span><i class=\"fa fa-bitcoin fa-lg\"></i>");
           	}else if (url==networkPower) {

           		$("#"+id).html(textLabel +"<span class=\"right_text_clr\">" + numberFormat(data)+"</span> GH/s");
           		 
           	//AND ALL THAT's left does this  
           	}else{
     
           	 $("#"+id).html(textLabel +"<span class=\"right_text_clr\">" + numberFormat(data)+"</span>");
           	};

           	//never seen this work so it's either I am using it wrong or there has been no fails
           },
           error: function (xhr, textStatus, errorThrown) {
               alert("Error: " + (errorThrown ? errorThrown : xhr.status));
           }
       });
}
//execute data acquisition
getValues(price24h, "price24h", "Price: <i class=\"fa fa-usd\"></i> ");
getValues(bcperblock, "bcperblock", "Coins per Block: ");
getValues(difficulty, "difficulty", "Difficulty: ");
getValues(currHeight, "currHeight", "Current Block Height: ");
getValues(nextHeight, "nextHeight", "Next Block Height: ");
getValues(timeBetweenBlocks, "timeBetweenBlocks", "Next Block: ");
getValues(marketcap, "marketcap", "Market Cap: <i class=\"fa fa-usd\"></i> ");
getValues(transactions24h, "transactions24h", "Transactions: ");
getValues(volume24h, "volume24h", "Volume Transacted: ");
getValues(networkPower, "networkPower", "Network Hashrate: ");

//obtain values for the chart

//we want an array in the form [['date_string',int],...['date_string',int]]
var graphArrayF = [];

$.ajax({
	            type: "GET",
	            url: "http://www.quandl.com/api/v1/datasets/BITCOIN/BITSTAMPUSD.json?auth_token=gfiRqaiZbyx6GEhyXzzv&trim_start=2012-12-30&trim_end=2013-12-25",
	            dataType: "text",
	            success: function (dataRec) {

                //This processes the JSON data into the form we need

	            	var array = JSON.parse("[" + dataRec + "]");
	            	// console.log(array);
	            	var arrayMaster = array[0];
	            	var values = arrayMaster.data;	            	
	            	for (var i = 0; i < values.length; i++) {
	            		var val = values[i];
	            		var graphArray1 = val.slice(0,1);
	            		var graphArray2= val.slice(7,8);

	            		graphArrayF.push("["+["\'"+graphArray1+"\'",graphArray2]+"]");


	            	};


	            	graphArrayF = JSON.stringify(graphArrayF);

	            	var test = eval(graphArrayF.replace(/"/g,"")).reverse();

	            	
	            	console.log(test);

	            	//draw the chart for price
	  
					
					var myChart = new JSChart('chartidprice', 'bar');
					myChart.setDataArray(test);
          myChart.setTitle('Bitcoin Price USD');
					myChart.setAxisNameX('30 Dec \'12-25 Dec \'12');
					myChart.setAxisNameY('$');
					myChart.setBarColor('#42aBdB');
					myChart.setBarOpacity(0.8);
					myChart.setBarBorderColor('#D9EDF7');
					myChart.setBarValues(false);
					myChart.setTitleColor('#8C8383');
					myChart.setAxisColor('#777E81');
					myChart.setAxisValuesColor('#777E81');
					myChart.resize(300, 300);
          

	            },
              //catch the error - usually means server down - draw example chart
	            error: function (xhr, textStatus, errorThrown) {
	                alert("Error: Quandl Seems Down" + (errorThrown ? errorThrown : xhr.status));
	                var myData = new Array(['Jan', 10], ['Feb', 12], ['March', 10], ['April', 14]);
					var myChart = new JSChart('chartid', 'bar');
					myChart.setDataArray(myData);
					myChart.setAxisNameX('30 Dec \'12-25 Dec \'12');
					myChart.setAxisNameY('$');
					myChart.setBarColor('#42aBdB');
					myChart.setBarOpacity(0.8);
					myChart.setBarBorderColor('#D9EDF7');
					myChart.setBarValues(false);
					myChart.setTitleColor('#8C8383');
					myChart.setAxisColor('#777E81');
					myChart.setAxisValuesColor('#777E81');
					myChart.draw();
	            }
	        });





});