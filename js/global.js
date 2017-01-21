var url_base = "http://127.0.0.1:8080/TMTrial/Services/"

$body = $("body");

$(document).on({
    ajaxStart: function() { 
    	$body.addClass("loading");
    	$("#LoadingImage").show();
	},
     ajaxStop: function() { 
     	$body.removeClass("loading");
     	$("#LoadingImage").hide(); 
 	}    
});

$(".dropdown-menu li a").click(function(){
    $('#selected').text($(this).text());
});

function getSearch(){
	$('#historics').addClass('hidden');
	$('#searches').removeClass('hidden');
	var option = $('#selected').text();
	var pattern = $('input[name="pattern"]').val();
	if(option == "Chose option"){
		bootbox.alert("Please pick an option first!");
	} else if (pattern == ""){
		bootbox.alert("Please introduce a search pattern!");
	} else{
		if (option == "Users"){
			var processUrl = url_base + "findUsersByName?name=" + pattern;
		} else if (option == "Pages"){
			var processUrl = url_base + "findPagesByName?name=" + pattern;
		} else if (option == "Events"){
			var processUrl = url_base + "findEventsByName?name=" + pattern;
		} else if (option == "Groups"){
			var processUrl = url_base + "findGroupsByName?name=" + pattern;
		}
		console.log("Gettin result from: "+processUrl);
		$.ajax({
		'url': processUrl,
		'type': 'GET',
		'content-Type': 'x-www-form-urlencoded',
		'dataType': 'json',
		'headers': {
			// Use access_token previously retrieved from inContact token 
			// service.
			//'Accept': 'application/json',
			//'Authorization': 'bearer ' + accessToken
		},
		'success': function (result) {
		//Process success actions
			//var returnResult = JSON.stringify(result);
			// console.log(result.response);
			var dataset = result.response.data.data;
			var datasetHtml = "";
			var type = result.response.type;
			var date = result.response.date;
			var pattern = result.response.pattern;
			// console.log(dataset);

			if (type == "User"){
				for (var i in dataset){
					datasetHtml += "<div class='panel panel-default'>"+
							            "<div class='panel-heading'>"+
							              "<h4 class='panel-title'>"+
							                "<a data-toggle='collapse' data-parent='#accordion' href='#collapse1'><i class='glyphicon glyphicon-user'></i> "+
							                dataset[i].name+"</a>"+
							              "</h4>"+
							            "</div>"+
							            "<div id='collapse1' class='panel-collapse collapse'>"+
							              "<div class='panel-body'><strong>Id: "+dataset[i].id+"</strong>"+
							              "</div>"+
							            "</div>"+
							          "</div>";
					
				}

			} else if (type == "Page"){
				for (var i in dataset){
					datasetHtml += "<div class='panel panel-default'>"+
							            "<div class='panel-heading'>"+
							              "<h4 class='panel-title'>"+
							                "<a data-toggle='collapse' data-parent='#accordion' href='#collapse1'><i class='glyphicon glyphicon-list-alt'></i> "+
							                dataset[i].name+"</a>"+
							              "</h4>"+
							            "</div>"+
							            "<div id='collapse1' class='panel-collapse collapse'>"+
							              "<div class='panel-body'><strong>Id: "+dataset[i].id+"</strong> / <strong>Category:</strong>"+dataset[i].category+
							              "</div>"+
							            "</div>"+
							          "</div>";
					
				}
				
			} else if (type == "Event"){
				for (var i in dataset){
					datasetHtml += "<div class='panel panel-default'>"+
							            "<div class='panel-heading'>"+
							              "<h4 class='panel-title'>"+
							                "<a data-toggle='collapse' data-parent='#accordion' href='#collapse1'><i class='glyphicon glyphicon-calendar'></i> "+
							                dataset[i].name+"</a>"+
							              "</h4>"+
							            "</div>"+
							            "<div id='collapse1' class='panel-collapse collapse'>"+
							              "<div class='panel-body'><strong>Id: "+dataset[i].id+"</strong> / <strong>Start Time:</strong>"+dataset[i].start_time+
							              "</div>"+
							            "</div>"+
							          "</div>";
				}
				
			} else if (type == "Group"){
				for (var i in dataset){
					datasetHtml += "<div class='panel panel-default'>"+
							            "<div class='panel-heading'>"+
							              "<h4 class='panel-title'>"+
							                "<a data-toggle='collapse' data-parent='#accordion' href='#collapse1'><i class='glyphicon glyphicon-education'></i> "+
							                dataset[i].name+"</a>"+
							              "</h4>"+
							            "</div>"+
							            "<div id='collapse1' class='panel-collapse collapse'>"+
							              "<div class='panel-body'><strong>Id: "+dataset[i].id+"</strong> / <strong>Privacy:</strong>"+dataset[i].privacy+
							              "</div>"+
							            "</div>"+
							          "</div>";
					
				}
			}
			// console.log(datasetHtml);
			$('#accordion').html(datasetHtml);
			return false;
		},
		'error': function (XMLHttpRequest, textStatus, errorThrown) {
			//Process error actions
			bootbox.alert("Hubo un error interno, es probable que el token de FB haya expirado, actualizelo!");
			console.log(textStatus);
			return false;
		}
	});
	}
}

var $table = $('#table');
$(function() {

  $table.bootstrapTable({
    columns: [{
      field: 'id',
      title: 'Main ID'
    },{
      field: 'date',
      title: 'Date'
    }, {
      field: 'type',
      title: 'Type'
    }, {
      field: 'pattern',
      title: 'Pattern'
    }, {
      field: 'action',
      title: ''
    }],
    data: [],
    detailView: true,
    onExpandRow: function(index, row, $detail) {
      console.log(row)
      $detail.html('<table></table>').find('table').bootstrapTable({
        columns: [{
          field: 'id',
          title: 'FB ID'
        }, {
          field: 'name',
          title: 'Name'
        }],
        data: row.nested,
        // Simple contextual, assumes all entries have further nesting
        // Just shows example of how you might differentiate some rows, though also remember row class and similar possible flags
        detailView: row.nested[0]['other'] !== undefined
      });

    }
  });
});

 $('#searchDate').daterangepicker({
	singleDatePicker: true,
	showDropdowns: true,
	startDate: moment(),
	locale: {
            format: 'DD/MM/YYYY'
        }
}, 
function(start, end, label) {
});

function switchToHistorics(){

	var pattern = $('#searchPattern').val('');
	var type = $('#searchType').val('None');
	var sort = $('#searchSort').val('None');
	var order = $('#searchOrder').val('ASC');
	var date = $('#searchDate').val(moment().format("DD/MM/YYYY"));
	$('#historics').removeClass('hidden');
	$('#searches').addClass('hidden');
}

function switchToSearches(){

	$('input[name="pattern"]').val('');
	$('#historics').addClass('hidden');
	$('#searches').removeClass('hidden');
}

function findHistorics(){

	$('#historics').removeClass('hidden');
	$('#searches').addClass('hidden');
	var pattern = $('#searchPattern').val();
	var type = $('#searchType').val();
	var sort = $('#searchSort').val();
	var order = $('#searchOrder').val();
	var date = $('#searchDate').val();
	var check = $('#searchCheck').is(":checked");
	var all = false;

	console.log(pattern+" "+type+" "+sort+" "+date+" "+order+" "+check);

	var processUrl = url_base;

	if ((type != "None") && (pattern != "") && (check != false)){

			processUrl += "findAllSets?type="+type+"&pattern="+pattern+"&date="+date;

	} else if ((type != "None") && (pattern != "") && (check == false)){

			processUrl += "findAllSets?type="+type+"&pattern="+pattern;

	} else if ((type != "None") && (pattern == "") && (check != false)){

			processUrl += "findAllSets?type="+type+"&date="+date;

	} else if ((type == "None") && (pattern != "") && (check != false)){

			processUrl += "findAllSets?pattern="+pattern+"&date="+date;

	} else if ((type != "None") && (pattern == "") && (check == false)){

			processUrl += "findAllSets?type="+type;

	} else if ((type == "None") && (pattern != "") && (check == false)){

			processUrl += "findAllSets?pattern="+pattern;

	} else if ((type == "None") && (pattern == "") && (check != false)){

			processUrl += "findAllSets?date="+date;

	} else {
			processUrl += "findAllSets";
			all = true;
	}

	if (sort != "None"){
		if (all == true){
			processUrl += "?sort="+sort+"&order="+order
		} else{
			processUrl += "&sort="+sort+"&order="+order
		}
	}

	console.log(processUrl);

	$.ajax({
		'url': processUrl,
		'type': 'GET',
		'content-Type': 'x-www-form-urlencoded',
		'dataType': 'json',
		'headers': {
			// Use access_token previously retrieved from inContact token 
			// service.
			//'Accept': 'application/json',
			//'Authorization': 'bearer ' + accessToken
		},
		'success': function (result) {
			var datasets = result.response;
			var tableData = "[";
			var nestedTableData = "[";
			// var type = result.response.type;
			// var date = result.response.date;
			// var pattern = result.response.pattern;
			console.log(datasets);

			// var data = [{
			//   'date': '1.1',
			//   'type': '1.2',
			//   'pattern': '1.2',
			//   'nested': [{
			//     'id': '1.3',
			//     'name': '1.4'
			//   }]
			// }]

			for (var i in datasets){
				tableData += '{'+
								'"id": "'+datasets[i].id+'",'+
								'"date": "'+datasets[i].date+'",'+
								'"type": "'+datasets[i].type+'",'+
								'"pattern": "'+datasets[i].pattern+'",'+
								'"action": "'+"<a class='remove ml10' href='javascript:void(0)' id='"+datasets[i].id+"'  onclick='removeSet(this)' title='Remove'><i class='glyphicon glyphicon-remove'></i></a>"+'",';

								var nestedDatasets = datasets[i].data.data;
								nestedTableData = '[';
								for (var j in nestedDatasets){
									nestedTableData += '{'+
															'"id": "'+nestedDatasets[j].id+'",'+
													     	'"name": "'+nestedDatasets[j].name.replace(/\\/g, '').replace(/"/g,'')+'"'+
													    '},';
								}
								nestedTableData = nestedTableData.slice(0, -1);
								nestedTableData += ']';

				tableData += 	'"nested": '+nestedTableData;
				tableData += '},';
			}

			if (datasets.length > 0) tableData = tableData.slice(0, -1);
			tableData += ']';

			console.log(JSON.parse(tableData));

			$('#table').bootstrapTable("destroy");
			$('#table').bootstrapTable({
			    columns: [{
			      field: 'id',
			      title: 'Main ID'
			    },{
			      field: 'date',
			      title: 'Date'
			    }, {
			      field: 'type',
			      title: 'Type'
			    }, {
			      field: 'pattern',
			      title: 'Pattern'
			    }, {
			      field: 'action',
			      title: ''
			    }],
			    data: JSON.parse(tableData),
			    detailView: true,
			    onExpandRow: function(index, row, $detail) {
			      console.log(row)
			      $detail.html('<table></table>').find('table').bootstrapTable({
			        columns: [{
			          field: 'id',
			          title: 'FB ID'
			        }, {
			          field: 'name',
			          title: 'Name'
			        }],
			        data: row.nested,
			        // Simple contextual, assumes all entries have further nesting
			        // Just shows example of how you might differentiate some rows, though also remember row class and similar possible flags
			        detailView: row.nested[0]['other'] !== undefined
			      });

			    }
			  });
			$('#table').bootstrapTable('refresh');

		},
		'error': function (XMLHttpRequest, textStatus, errorThrown) {
			//Process error actions
			bootbox.alert("Hubo un error interno, por favor contacte al administrador del sistema!");
			console.log(textStatus);
			return false;
		}
	});

}

function removeSet(element){
	// console.log(element.id);
	var id = element.id;
	$.ajax({
		'url': url_base+"deleteSet?id="+id,
		'type': 'GET',
		'content-Type': 'x-www-form-urlencoded',
		'dataType': 'json',
		'headers': {
			// Use access_token previously retrieved from inContact token 
			// service.
			//'Accept': 'application/json',
			//'Authorization': 'bearer ' + accessToken
		},
		'success': function (result) {
			bootbox.alert(result.message);
			findHistorics();
			return true;
		},
		'error': function (XMLHttpRequest, textStatus, errorThrown) {
			//Process error actions
			bootbox.alert("Hubo un error interno, por favor contacte al administrador del sistema!");
			console.log(textStatus);
			return false;
		}
	});
}