var app = {
     initialize: function() {
        document.addEventListener('deviceready', deviceSiap, false);
    },
};

app.initialize();

var db = null;
function deviceSiap(){
    db = window.openDatabase('lelang','1.0','db_lelang', 5 * 1024 * 1024);
    if(db) {
        db.transaction(createTable, dbGagal, dbSukses);
    } else {
        alert('Gagal membuat Database');
    }
   	
   	document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            document.addEventListener("backbutton", function (e) {
                var ses_loged = sessionStorage.getItem('loged');
                        
                if ($.mobile.activePage.is('#pagehome')) {
                	navigator.app.exitApp();
                }
                /*else if($.mobile.activePage.is('#pagefive') && ses_loged == '1' ){ 
                    $(':mobile-pagecontainer').pagecontainer('change', '#pageone');
                }*/
                else if($.mobile.activePage.is('#pagehome') && ses_loged == null ){ 
                    navigator.app.exitApp();
                }
                else {
                    $.mobile.back();
                }
            }, false );

   }      
}

function createTable(tx) {
      tx.executeSql(
        ' CREATE TABLE IF NOT EXISTS peserta (id_peserta integer primary key, nama text, '
        + ' nomor_rekening text, nomor_telepon text, nik integer, alamat text, email text )' 
        ); 

       tx.executeSql(
        ' CREATE TABLE IF NOT EXISTS unique_key (id_unique_key integer primary key, peserta_id integer, key text, '
        + ' status text, expired_date text, date_log text)' 
        ); 
       tx.executeSql(
        ' CREATE TABLE IF NOT EXISTS jaminan (id_jaminan integer primary key, nominal text, unique_key_id integer )' 
        ); 

       tx.executeSql('SELECT u.id_unique_key , u.peserta_id, u.key, p.nama, p.nomor_rekening FROM peserta p, unique_key u where p.id_peserta = u.peserta_id', [], querySuccess, errorCB);

       function querySuccess(tx, results) {
		    var len 				= results.rows.length;
		    //alert(len);
	        if (len == 0) {
	              tx.executeSql('INSERT INTO peserta (id_peserta , nama, nomor_rekening, nomor_telepon, nik, alamat, email)'
	              + ' VALUES (0,0,0,0,0,0,0)');
	              tx.executeSql('INSERT INTO unique_key (id_unique_key , peserta_id, key, status, expired_date, date_log) '
	              + ' VALUES (0,0,0,0,0,0)');
	              tx.executeSql('INSERT INTO jaminan (id_jaminan , nominal, unique_key_id )'
	              + ' VALUES (0,0,0)');
	        }
	        else if (len == 1 && id_unique_key == 0 ) {
	            sessionStorage.removeItem('loged');
	            sessionStorage.removeItem('id_unique_key');
	            sessionStorage.removeItem('peserta_id');
	            sessionStorage.removeItem('key');
	            sessionStorage.removeItem('nama');
	            sessionStorage.removeItem('nomor_rekening');

	            $('.panel_name').empty();
	        	$('.panel_rekening').empty();
	            $('.panel_profile').css('display','none');
				$('.menu-dashboard').css('display','none');
				$('.menu-login').css('display','');
				$('.menu-logout').css('display','none');
	        }
	        else if (len == 1 && id_unique_key > 0 ) {
	            var id_unique_key 	= results.rows.item(0).id_unique_key;
			    var peserta_id 		= results.rows.item(0).peserta_id;
			    var key 				= results.rows.item(0).key;
			    var nama 				= results.rows.item(0).nama;
			    var nomor_rekening	= results.rows.item(0).nomor_rekening;
	            sessionStorage.setItem('loged','1');
	            sessionStorage.setItem('id_unique_key',id_unique_key);
	            sessionStorage.setItem('peserta_id',peserta_id);
	            sessionStorage.setItem('key',key);
	            sessionStorage.setItem('nama',nama);
	            sessionStorage.setItem('nomor_rekening',nomor_rekening);

	        	$('.panel_name').append(nama);
	        	$('.panel_rekening').append(nomor_rekening);
				$('.panel_profile').css('display','');
				$('.menu-dashboard').css('display','');
				$('.menu-login').css('display','none');
				$('.menu-logout').css('display','');
	        }
		}

		function errorCB(err) {
		    alert("Error processing SQL: "+err.code);
		}
  
}

function dbGagal(tx,e){
    alert('Aduh Error! '+e);
}

function dbSukses(){
    alert ('Database OK.');
}

//var server = '.168.43.19242:80';
var server = '192.168.43.42:8000/api/v1';

/*------------CEK STATUS LOGED/TIDAK-----------*/
var ses_loged 		= sessionStorage.getItem('loged');
var id_unique_key	= sessionStorage.getItem('id_unique_key');
var peserta_id	 	= sessionStorage.getItem('peserta_id');
var key	 			= sessionStorage.getItem('key');
var nama	 		= sessionStorage.getItem('nama');
var nomor_rekening	= sessionStorage.getItem('nomor_rekening');

if(ses_loged == '1' ) {
	$('.panel_name').empty();
    $('.panel_rekening').empty();
	$('.panel_name').append(nama);
    $('.panel_rekening').append(nomor_rekening);
	$('.panel_profile').css('display','');
 	$('.menu-dashboard').css('display','');
 	$('.menu-login').css('display','none');
 	$('.menu-logout').css('display','');
}else{
	$('.panel_name').empty();
    $('.panel_rekening').empty();
	$('.panel_profile').css('display','none');
	$('.menu-dashboard').css('display','none');
	$('.menu-login').css('display','');
	$('.menu-logout').css('display','none');
}

$(document).on("pageshow", "#pagelogin", function(){
	if (ses_loged == '1'){
		window.location = "#pagehome";
	}
});

$(document).on("pageshow", "#pagehome", function(){	
	// $.ajax({
 //        method: 'get',
 //        url: 'http://'+server+'/apilelang/select-dashboard.php',
 //        dataType: 'json',
 //        success: function(data){
 //        	var data = data;
 //        	$('#dashprop').text(data[0].properti);
 //        	$('#dashpes').text(data[0].peserta);
 //        	$('#dashtx').text(data[0].transaksi);
 //        },
 //        error: pesanGagal
 //    });
});



$(document).on("pageshow", "#pagebarang", function(){
	// TAMPIL DATA
	$.ajax({
        method: 'get',
        url: 'http://'+server+'/properti/list',
        dataType: 'json',
        success: tampilSukses,
        error: pesanGagal
    });

	function tampilSukses(data){
		//if (data.status == '1') {
			var barang = data;
			$("#konten-brg").empty();

			// TAMPIL DATA PER BARANG
			for (var i = 0; i < barang.length; i++) {
				$("#konten-brg").append('<div class="col-md-12"> <div class="card"> <div class="header"> <h2> '+barang[i].nama+' <small><span class="badge bg-green">Rp. '+pisahKoma(barang[i].harga)+',-</span></small> </h2> </div> <div class="body"> <div id="aniimated-thumbnials" class="list-unstyled row clearfix"> <div class="col-md-12"> <a href="#pagedetailbrg" class="a-detail" data-sub-html="Description" param="'+barang[i].id+'"> <img class="img-responsive thumbnail align-center" src='+barang[i].photo_medium+'> </a> </div> </div> <h5>Tanggal Lelang : <br/><br/> <span class="badge bg-red text-center">'+barang[i].tanggal_mulai.substr(0,10)+' s/d '+barang[i].tanggal_akhir.substr(0,10)+'</span></h5> <div> <p>'+barang[i].deskripsi.substr(0,500)+' ....'+'</p> <div class="row"> <div class="col-xs-6"> <a href="#pagebid" class="btn btn-block btn-lg bg-deep-orange waves-effect btn-pilih" param="'+barang[i].id+'"><i class="material-icons">done</i> Pilih</a> </div> <div class="col-xs-6"> <a href="#pagedetailbrg" id="btndetailbrg" class="btn btn-block btn-lg bg-blue waves-effect btn-pilih" param="'+barang[i].id+'"><i class="material-icons">&#xe8ef;</i> Detail</a> </div> </div> </div> </div> </div> </div>');
			}
		//}
	}
});

function pesanGagal(){
	alert('Ooppss, ERROR!');
}

function pisahKoma(angka){
	return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

var selected = "";

$("#konten-brg").on('click', 'a.btn-pilih', function(event){
	$('#namaprop').empty();
	$('.inpbid').val('');
	$('.btnbid').attr('param', '');
	// var param = '&id='+$(this).attr('param');
	var param = $(this).attr('param');
	selected = param;
	$.ajax({
        // method: 'post',
        method: 'get',
        // url: 'http://'+server+'/apilelang/tampil.php',
        url: 'http://'+server+'/properti/detail/'+param,
        // data: param,
        dataType: 'json',
        success: tampilDataSukses,
        error: pesanGagal
	});
	function tampilDataSukses(data){
	    //alert('mulai tampil data!');
	    $('#tdnama').empty();
	    $('#tdtglmulai').empty();
	    $('#tdtglselesai').empty();
	    $('#tdkategori').empty();
	    $('#tdhrgmin').empty();
	    $('#tddeskripsi').empty();

	    // $('#imgdetail1').attr("src", "http://"+server+"/apilelang/"+barang[0].photo_path);
	    $('#imgdetail1').attr("src", data.photo_medium);
	    $('#tdnama').append(data.nama);
	    $('#tdtglmulai').append(data.tanggal_mulai.substr(0,10));
	    $('#tdtglselesai').append(data.tanggal_akhir.substr(0,10));
	    $('#tdkategori').append(data.kategori_id);
	    $('#tdhrgmin').append(pisahKoma(data.harga));
	    $('#tddeskripsi').append(data.deskripsi);

	    tglplus1 = addDays(data.tanggal_akhir, 1);
	    //alert(tglplus1);
	    var counttgl = tglplus1.substr(0,10).replace(/\-/g,'/');
		$('#clock2').countdown(counttgl, function(event) {
			if (event.strftime('%d') == '00' && event.strftime('%H') == '00' && event.strftime('%M') == '00' && event.strftime('%S') == '00') {
				$(".btnbid").addClass('disabled');
				var $this = $(this).html('<span class="label-waktu label-danger">lelang telah selesai</span>');	
			} else {
		  		var $this = $(this).html(event.strftime('<span class="label-waktu label-danger">%dh %Hj %Mm %Sd</span>'));
				$(".btnbid").removeClass('disabled');
			}
		});
		$('#namaprop').append(data.nama);
		$('.btnbid').attr('param', selected);
	}
});

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    var tgl = result.getFullYear()+'/'+(result.getMonth()+1)+'/'+result.getDate();
    return tgl;
}

// ACTION MENU
	$('.menu-home').click(function(){
		window.location = "#pagehome";
	});
	$('.menu-barang').click(function(){
		window.location = "#pagebarang";
	});
	$('.menu-jadwal').click(function(){
		window.location = "#pagejadwal";
	});
	$('.menu-profil').click(function(){
		window.location = "#pageprofil";
	});
	$('.menu-login').click(function(){
		window.location = "#pagelogin";
	});
	$('.menu-syarat').click(function(){
		window.location = "#pagesyarat";
	});
	$('.menu-about').click(function(){
		window.location = "#pageabout";
	});
	$('.menu-logout').click(logout);
	$('#btnhome').click(function(){
		window.location = "#pagehome";
	});
   
// END ACTION MENU

$('#btnpgprofilok').click(function(){
	var uniquekey = $('#inpunique').val();
	if (uniquekey == '') {
		alert("Unique Key Tidak Boleh Kosong!");
	} else{
		var param = "&uniqueKey="+uniquekey;
		$.ajax({
			method: 'post',
			url: 'http://'+server+'/peserta/uniquekey',
			data: param,
			dataType: 'json',
			success: suksesGetProfil,
			error: pesanGagal,
		});
	}

	function suksesGetProfil(data){
		//alert('Berhasil!');
		var profil = data;

		$('#detnama').empty();
		$('#detnik').empty();
		$('#detnorek').empty();
		$('#detalamat').empty();
		$('#detnohp').empty();
		$('#detjaminan').empty();

		$('#detnama').append(profil.nama);
		$('#detnik').append(profil.nik);
		$('#detnorek').append(profil.nomor_rekening);
		$('#detalamat').append(profil.alamat);
		$('#detnohp').append(profil.nomor_telepon);
		$('#detjaminan').append(profil.nominal);
	}
});

/*-----------ENABLE TOMBOL LOGIN------------*/ 
$('#inploguniq').on('keyup',enableLogin);

function enableLogin(){
    var inploguniq = $('#inploguniq').val(); 
    if(inploguniq == ''){
        $('#btnlogin').attr('disabled','true');
    }
    else {
        $('#btnlogin').removeAttr('disabled','false');  
    }
 }

/*-----------PROSES LOGIN------------*/ 
$('#btnlogin').click(function() {
	var inpunique = $('#inploguniq').val();

	if (inpunique == '') {
		alert('Unique Key Tidak Boleh Kosong!');
	} else {
		var data = 'uniqueKey='+inpunique;
		$.ajax({
			method : 'post',
			data : data,
			dataType : 'json' ,
			url : 'http://'+server+'/peserta/uniquekey',
			success: function(data){
		        var biodata = data;
		        console.log(biodata.data);
		        if(biodata.status != 'error'){
		          	var loged = 1;
		            $('#inploguniq').val("");
		            $('#btUnique').attr('disabled','true');
		            insertLog(biodata,loged);
		            
		        } else {
		            $('#inploguniq').val("");
		            alert("Anda Belum Terdaftar");
		            alert(biodata.message);
		            $('#btUnique').attr('disabled','true');  
		        }
		    },
		    error : function(e){
		    	if (e.status == 400) {
		    		alert('Key tidak ditemukan atau telah expired.');
		            $('#inploguniq').val("");
		    	}
		    }
		});
	}
	
	function insertLog(data,log){
        $id_unique_key  = data.id; 
        $peserta_id     = data.peserta_id;
		$key     		= data.key;
        $status     	= data.status;
        $expired_date   = data.expired_date;
        $date_log     	= Date();
                
        $id_peserta		= data.peserta.id;
        $nama			= data.peserta.nama;
        $nomor_rekening	= data.peserta.nomor_rekening;
        $nomor_telepon	= data.peserta.nomor_telepon;
        $nik			= data.peserta.nik;
        $alamat			= data.peserta.alamat;
        $email			= data.peserta.email;
        
        $id_jaminan		= data.jaminan.id;
        $nominal		= data.jaminan.nominal;
        $unique_key_id	= data.jaminan.unique_key_id;
      
        db.transaction(function(tx) {
          tx.executeSql(" UPDATE peserta SET id_peserta = ?, nama = ?, nomor_rekening = ?, nomor_telepon = ?, nik = ?, alamat = ?, email = ? ",
          [$id_peserta,	$nama, $nomor_rekening, $nomor_telepon, $nik, $alamat, $email ] );
          tx.executeSql(" UPDATE unique_key SET id_unique_key = ?, peserta_id = ?, key = ?, status = ?, expired_date = ?, date_log = ? ",
          [$id_unique_key,	$peserta_id, $key, $status, $expired_date, $date_log ] );
          tx.executeSql(" UPDATE jaminan SET id_jaminan = ?, nominal = ?, unique_key_id = ? ",
          [$id_jaminan,	$nominal, $unique_key_id ] );
         }, function(error) {
              alert("Ooops eror");
        }, function() {
          	sessionStorage.setItem('loged','1');
          	sessionStorage.setItem('id_unique_key',$id_unique_key);
            sessionStorage.setItem('peserta_id',$peserta_id);
            sessionStorage.setItem('key',$key);
            sessionStorage.setItem('nama',$nama);
            sessionStorage.setItem('nomor_rekening',$nomor_rekening);
        	
        	$('.panel_name').append($nama);
        	$('.panel_rekening').append($nomor_rekening);
          	$('.panel_profile').css('display','');
		 	$('.menu-dashboard').css('display','');
		 	$('.menu-login').css('display','none');
		 	$('.menu-logout').css('display','');
	        alert("Login success");
	        window.location = "#pagehome";
        });
	}
});

/*-----------------PROSES LOGOUT-------------------*/
function logout(){

		if(confirm('Apakah anda yakin untuk Logout ?')) {
            db.transaction(function(tx) {
	          tx.executeSql(" UPDATE peserta SET id_peserta = ?, nama = ?, nomor_rekening = ?, nomor_telepon = ?, nik = ?, alamat = ?, email = ? ",
	          [0, 0, 0, 0, 0, 0, 0 ] );
	          tx.executeSql(" UPDATE unique_key SET id_unique_key = ?, peserta_id = ?, key = ?, status = ?, expired_date = ?, date_log = ?",
	          [0, 0, 0, 0, 0, 0 ] );
	          tx.executeSql(" UPDATE jaminan SET id_jaminan = ?, nominal = ?, unique_key_id = ? ",
	          [0, 0, 0 ] );
	        }, function(error) {
	            alert("Ooops eror");
	        }, function() {
	          	sessionStorage.removeItem('loged');
	          	sessionStorage.removeItem('id_unique_key');
	            sessionStorage.removeItem('peserta_id');
	            sessionStorage.removeItem('key');
	            sessionStorage.removeItem('nama');
	            sessionStorage.removeItem('nomor_rekening');

	            $('.panel_name').empty();
	        	$('.panel_rekening').empty();
	        	$('.panel_profile').css('display','none');
				$('.menu-dashboard').css('display','none');
				$('.menu-login').css('display','');
				$('.menu-logout').css('display','none');
			        
		        alert("Terimakasih ..");
		        window.location = "#pagehome";
	        })
        }
        return false;
}

$(document).on("pageshow", "#pagejadwal", function(){
	$.ajax({
		method : 'get',
		url : 'http://'+server+'/properti/list',
		dataType : 'json',
		success : suksesGetJadwal,
		error : pesanGagal
	});

	function suksesGetJadwal(data){
		var jadwal = data;
		$('#konten-jadwal').empty();
		//alert('OK');
		for (var i = 0; i < jadwal.length; i++) {
			$('#konten-jadwal').append('<tr><td><strong>'+jadwal[i].nama+'</strong></td></tr><tr><td>'+jadwal[i].tanggal_mulai.substr(0,10)+' s/d '+jadwal[i].tanggal_akhir.substr(0,10)+'</td></tr>');
		}
	}
});

// INPUT QUERY
$('.btnbid').click(function(){
	var jmlbid = $('.inpbid').val().replace(/\./g,"");
	var id_unique_key = sessionStorage.getItem('id_unique_key');
	var id_prop = $('.btnbid').attr('param');
	var logged = sessionStorage.getItem('loged');
	$('.inpbid').val('');

	if (jmlbid == '') {
		alert('Jumlah Penawaran Tidak Boleh Kosong!');
	} else {
		if (logged == '1') {
			var data = {
				properti_id : id_prop,
				unique_key_id : id_unique_key,
				penawaran : jmlbid
			}
			alert(data);

			$.ajax({			
			method : 'post',
			data : data,
			dataType : 'json' ,
			url : 'http://'+server+'/transaksi/store',
			success: function(data){
				if (data.status != 'error') {
			        alert(data.message);
			        window.location = '#pagehome';
				} else {
					alert('Aduhh error. '+data.message);
					window.location = '#pagebarang';
				}
		    },
		    error: function(e){
		    	var er = e;
		    	alert('Maaf, transaksi Gagal.');
		    }
		});
		} else {
			alert('Maaf, Anda harus login lebih dulu.');
			window.location = '#pagelogin';
		}
	}
});