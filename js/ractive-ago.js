
var RactiveAgo = Ractive.extend({
	isolated: true,
	/*
	template:
		"<span class='{{class}}' style='{{style}}'>\
		{{#y}}{{y}}y{{/y}}				\
		{{#mt}}{{mt}}M{{/mt}}				\
		{{#w}}{{w}}w{{/w}}				\
		{{#d}}{{d}}d{{/d}}				\
		{{#h}}{{h}}h{{/h}}				\
		{{#m}}{{m}}m{{/m}}				\
		{{#s}}{{s}}s{{/s}}				\
		</span>",
	*/

	template:
		"<span class='{{class}}' style='{{style}}'>		\
		{{#y}}								\
			{{y}} years							\
		{{else}}								\
			{{#mt}}							\
				{{mt}} months					\
			{{else}}							\
				{{#w}}						\
					{{w}} weeks					\
				{{else}}						\
					{{#d}}					\
						{{d}} days				\
					{{else}}					\
						{{#h}}				\
							{{h}} hours			\
						{{else}}				\
							{{#m}}			\
								{{m}} min		\
							{{else}}			\
								{{s}} sec		\
							{{/m}}			\
						{{/h}}				\
					{{/d}}					\
				{{/w}}						\
			{{/mt}}							\
		{{/y}}								\
		</span>",

	timeout: function() {
		return this.elapsed() < 60 ? 5 : (this.elapsed() < 60*60 ? 60 : ( 60 ))
	},
	elapsed: function() {
		return Math.floor((new Date().getTime() - this.get('timestamp'))/1000)
	},
	tick: function() {

		var now = new Date().getTime()

		//-----------------------------
		var yz = {}
		for (var i = this.get('timestamp'); i<= now; i=i+(1000*60*60*24)) yz[new Date(i).toISOString().substr(0,4)] = null
		var y = Object.keys(yz).length-1

		var timestamp = new Date((parseInt(new Date(this.get('timestamp')).toISOString().substr(0,4)) + y).toString() + new Date(this.get('timestamp')).toISOString().substr(4,100)).getTime()
		if (timestamp > now) {
			y = y-1
			timestamp = new Date((parseInt(new Date(this.get('timestamp')).toISOString().substr(0,4)) + y).toString() + new Date(this.get('timestamp')).toISOString().substr(4,100)).getTime()
		}
		//console.log("after", y , "years , date is ", new Date(timestamp).toISOString() )



		//-----------------------------
		var mz = {}
		for (var i = timestamp; i<= now; i=i+(1000*60*60*24)) mz[new Date(i).toISOString().substr(0,7)] = null
		var mt = Object.keys(mz).length-1

		var timestamp = (function(date, now ) {
			var d = new Date(date)
			d.setMonth(d.getMonth() + mt)
			if (d.getTime() < now )
				return d.getTime()

			mt = mt - 1
			var d = new Date(date)
			d.setMonth(d.getMonth() + mt)
			return d.getTime()
		})(new Date(timestamp), now )
		//console.log("after", mt , "months , date is ",new Date(timestamp).toISOString())



		//-----------------------------
		var w = Math.floor(Math.floor((now - timestamp)/(1000*60*60*24))/7)
		if (new Date(timestamp + (1000*60*60*24*7*w)).getTime() > now  )
			w = w - 1
		timestamp = timestamp + (1000*60*60*24*7*w)
		//console.log("after", w, "weeks, date is ",new Date(timestamp).toISOString())


		//-----------------------------
		var d = Math.floor(Math.floor((now - timestamp)/(1000*60*60*24)))
		if (new Date(timestamp + (1000*60*60*24*d)).getTime() > now  )
			d = d - 1
		timestamp = timestamp + (1000*60*60*24*d)
		//console.log("after", d, "days, date is ",new Date(timestamp).toISOString())

		//-----------------------------
		var h = Math.floor(Math.floor((now - timestamp)/(1000*60*60)))
		if (new Date(timestamp + (1000*60*60*h)).getTime() > now  )
			h = h - 1
		timestamp = timestamp + (1000*60*60*h)
		//console.log("after", h, "hours, date is ",new Date(timestamp).toISOString())

		//-----------------------------
		var m = Math.floor(Math.floor((now - timestamp)/(1000*60)))
		if (new Date(timestamp + (1000*60*m)).getTime() > now  )
			m = m - 1
		timestamp = timestamp + (1000*60*m)
		//console.log("after", m, "min, date is ",new Date(timestamp).toISOString())

		//-----------------------------
		var s = Math.floor(Math.floor((now - timestamp)/(1000)))
		if (new Date(timestamp + (1000*s)).getTime() > now  )
			s = s - 1
		timestamp = timestamp + (1000*s)
		//console.log("after", s, "sec, date is ",new Date(timestamp).toISOString())

		this.set('y', y )
		this.set('mt', mt )
		this.set('w', w )
		this.set('d', d )
		this.set('h', h )
		this.set('m', m )
		this.set('s', s )
		//console.log("elapsed=",this.elapsed(),"y=",y,"months=",mt,"w=",w,"d=",d,"h=",h,"m=",m,"s=",s)

		this.interval = setTimeout( this.tick.bind( this ), this.timeout() * 1000 );
	},
	onrender: function () {

		if (!this.get('timestamp'))
			this.set('timestamp', new Date().getTime())

		this.interval = setTimeout( this.tick.bind( this ), this.timeout() * 1000 );

		this.tick()

		this.on( 'teardown', function () {
			clearInterval( this.interval )
		})
	},
	data: {},
})
Ractive.components.ago = RactiveAgo
