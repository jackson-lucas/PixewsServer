(function () {

function dateFormatFilter () {
	return function (input){
    var dateSplitted, dateApiForm;
		if (input) {
			dateSplitted = input.split('-');
			dateFormat = + dateSplitted[2].split('T')[0] + '/'
				+ dateSplitted[1] + '/' + dateSplitted[0];

			return dateFormat;
		}
	};
}

angular.module("pixewsWeb").filter("dateFormatFilter", dateFormatFilter);

})()
