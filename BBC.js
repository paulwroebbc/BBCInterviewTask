var BBC = function( element, data ) {

	//	Store local copy of data
	this.JSONData = data;		

	//	Extract key dates from JSON data e.g. ['2009-01', '2009-02', ...]
	this.keyDates = Object.keys( this.JSONData );
	
	//	Extract key headings from JSON data e.g. ['bbcfour', 'bbcnews24', ...]
	this.keyHeadings = Object.keys( this.JSONData[ this.keyDates[ 0 ] ] );
	
	//	Table container element
	this.tableContainer = element;
	
	//	Visualization container element
	this.chartContainer = undefined;

	/*	
	*	Object containing full month names.
	*	Each month number is mapped to its corrosponding
	*	full month name that appears within the page.
	*/
	this.months = {
		'01' : 'January',
		'02' : 'February',
		'03' : 'March',
		'04' : 'April',
		'05' : 'May',
		'06' : 'June',
		'07' : 'July',
		'08' : 'August',
		'09' : 'September',
		'10' : 'October',
		'11' : 'November',
		'12' : 'December'
	};

	/*
	*	Object containing formatted channel names.
	*	Each channel is mapped to a corrosponding formatted channel name
	*	to appear within the page.
	*/
	this.channels = {
		'bbcfour' : 'BBC Four',
		'bbcnews24' : 'BBC News 24',
		'bbcone' : 'BBC One', 
		'bbcthree' : 'BBC Three',
		'bbctwo' : 'BBC Two',
		'cbbc' : 'CBBC',
		'cbeebies' : 'Cbeebies'	
	};

	/*
	*	Shortcut method for creating HTML elements.
	*/
	this.create = function( tagName ) {

		//	Create and return the HTML element
		return document.createElement( tagName );

	};

	/*
	*	Build and assembles table and
	*	calls methods to build table elements e.g. thead.
	*/  
	this.buildTable = function() {

		//	Create HTML 'table' element : <table>
		var table = this.create( 'table' );

		//	Build table head and append to table
		table.appendChild( this.buildTHead() );

		//	Build table body and append to table
		table.appendChild( this.buildTBody() );
		
		//	Check table container element is not undefined	
		if( this.tableContainer !== undefined ) {

			//	Append HTML table element to container	
			this.tableContainer.appendChild( table );

		}

	};

	/*
	*	Builds and returns table head <thead>
	*/
	this.buildTHead = function() {
		
		//	Create HTML thead element : <thead>
		var thead = this.create( 'thead' ),

			//	Create HTML th element : <th>
			th = this.create( 'th' ),

			//	Create HTML tr element : <tr>
			tr = this.create( 'tr' ),

			//	Iterator variable for loop
			i;
		
		//	Create text node and append to th element : <th>Date</th>
		th.appendChild( document.createTextNode( 'Date' ) );

		//	Append th element to tr element : <tr><th>Date</th></td>
		tr.appendChild( th );

		//	Loop through key headings to create headings
		for ( i = 0; i < this.keyHeadings.length; i++ ) {
			
			//	Create HTML th element
			var th = this.create( 'th' ),
				
				//	Store heading in variable
				heading = this.channels[ this.keyHeadings[ i ] ];

			//	Create text node and append to th element : <th>Heading</th>					
			th.appendChild( document.createTextNode( heading ) );
			
			//	Append th element to tr elemtn : <tr><th>Heading</th></tr>
			tr.appendChild( th );

		}

		//	Append tr element to thead element
		thead.appendChild( tr );

		//	Return constructed thead element
		return thead;

	};

	/*
	*	Creates and returns an appropriately
	*	formatted date e.g. 'January 2009'
	*/
	this.formatDate = function( dateString ) {

		//	Extract full month name from object	
		var month = this.months[ dateString.substr( 5, 6 ) ];	

		//	Extract year from date string
		var year = dateString.substr( 0, 4 );

		//	Return formatted date	
		return month + ' ' + year;

	};

	/*
	*	Builds the table body <tbody>
	*/
	this.buildTBody = function() {

		//	Create HTML tbody element : <tbody>
		var tbody = this.create( 'tbody' ),
			
			//	Local copy of JSON data
			data = this.JSONData,

			//	Iterator variable for loop
			i,

			//	Iterator variable for loop
			j;

		//	Loop through key dates to build table rows
		for ( i = 0; i < this.keyDates.length; i++ ) {
			
			//	Current key e.g. 2009-01		
			var keyDate = this.keyDates[ i ],

				//	Formatted date string e.g. 'January 2009'
				date = this.formatDate( keyDate ),

				//	Create text node for formatted date
				date = document.createTextNode( date );
				
				//	Create HTML element tr : <tr>
				tr = this.create( 'tr' ),

				//	Create HTML element td : <td>
				td = this.create( 'td' );

			//	Check if chart container has been specified
			if ( this.chartContainer !== undefined ) {
				
				//	Create HTML element a : <a>
				var a = this.create( 'a' ),

					//	Store local copy of 'this' to overcome scope issues
					self = this;

				//	Set value of href attribute
				a.setAttribute( 'href', '#' );

				//	Add data-keyDate attribute to support visualization
				a.setAttribute( 'data-keydate', keyDate );

				//	Create text node and append to HTML element a
				a.appendChild( date );
				
				//	Add click event listener to link
				a.addEventListener( 'click', self.visualize.bind( this ), false );
			
				//	Append link element to to td element
				td.appendChild( a );

			} else {

				//	Append text node to td element
				td.appendChild( date );

			}

			//	Append td element to tr element
			tr.appendChild( td );

			//	Loop through each key heading
			for ( j = 0; j < this.keyHeadings.length; j++ ) {

				//	Create HTML element td
				var td = this.create( 'td' ),

					// Key heading e.g. 'bbcFour'
					keyHeading = this.keyHeadings[ j ],
					
					//	Create text node for value
					value = document.createTextNode( data[ keyDate ] [ keyHeading ] );

				//	Append value to HTML td element
				td.appendChild( value );
				
				//	Append td element to tr
				tr.appendChild( td );

			}

			//	Append constructed table row to table table body element
			tbody.appendChild( tr );

		}

		//	Return constructed table body
		return tbody;

	};

	/*
	*	Creates visualization table elements
	*	and displays appropriate data based on
	*	clicked element.
	*/
	this.visualize = function( event ) {
		
		//	Prevent default behaviour when link is clicked
		event.preventDefault();

		//	Empty/remove inner content of chart container
		this.chartContainer.innerHTML = '';

		//	Get key date value from link's data attribute e.g. '2009-01'
		var keyDate = event.target.getAttribute( 'data-keydate' ),

			//	Create HTML table element : <table>
			table = this.create( 'table' ),

			//	Create HTML tbody element : <tbody>
			tbody = this.create( 'tbody' ),

			//	Create HTML thead element : <thead>
			thead = this.create( 'thead' ),

			//	Create HTML tr element : <tr>
			tr = this.create( 'tr' ),

			//	Create HTML th element : <th>
			th = this.create( 'th' ),

			//	Format date e.e. January 2009
			date = this.formatDate( keyDate ),

			//	Get data/object for key date
			data = this.JSONData[ keyDate ],

			//	Variable to hold total value
			total = 0,

			//	Variable for use within for loop
			channel;
		
		//	Set column span of <th>
		th.setAttribute( 'colspan', '2' );

		//	Append date text node to table heading element <th>
		th.appendChild( document.createTextNode( date ) );

		//	Append table heading element to table row element
		tr.appendChild( th );

		//	Append table row to table head <thead> element 
		thead.appendChild( tr );

		//	Append table heading to table element
		table.appendChild( thead );

		//	Loop through object to calculate total of
		//	all channel values for key date
		for ( channel in data ) {

			//	Increase total by value
			total += data[ channel ];

		}

		//	Loop through data/object to generate HTML table
		//	and visualization features
		for ( channel in data ) {

			//	Calculate percentage value
			var percentage = ( data[ channel ] / total ) * 100,
				
				//	Create HTML tr element : <tr>
				tr = this.create( 'tr' ),

				//	Create HTML element td to store channelname
				channel_td = this.create( 'td' ),

				//	Create HTML element td to store channel value
				value_td = this.create( 'td' ),

				//	Create HTML div element to indicate/visualize value
				bar = this.create( 'div' ),

				//	Get formatted channel name
				formattedChannel = this.channels[ channel ];
			
			//	Set width of bar to visualize value
			bar.style.width = data[ channel ] / 2 + 'px';

			//	Add class name to bar element to attach styling
			bar.className = 'visualize';

			//	Create text node containing channel data and append to bar element
			bar.appendChild( document.createTextNode( data[ channel ] + " (" + percentage.toFixed( 2 ) + "%)" ) );

			//	Create text node containing formatted channel name and append to td element
			channel_td.appendChild( document.createTextNode( formattedChannel ) );

			//	Append channel td element to tr element
			tr.appendChild( channel_td );
			
			//	Append bar element to td element
			value_td.appendChild( bar );

			//	Append td element to tr element
			tr.appendChild( value_td );
			
			//	Append constructed tr element to tbody element
			tbody.appendChild( tr );

		}

		//	Append tbody to table element
		table.appendChild( tbody );

		//	Append constructed table to chart container element
		this.chartContainer.appendChild( table );

	};

};