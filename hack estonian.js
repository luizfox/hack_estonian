//animation: listen and read

function getElementByXpath(path) {
   return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function enableTranslationForRow(row){
  row.childNodes[2].firstChild.click();
}

function getTranslationForElement(element){
	return element.innerHTML;
}

function getAudioUrl() {
	var aud = document.getElementById("audio-0");
	return aud.firstChild.src;
}

function downloadURI(uri) {
    var link = document.createElement("a");
    link.download = uri.substring(uri.lastIndexOf('/')+1);;
    link.href = uri;
    link.click();
    return link.download;
}

function showLabels() { // 1
	tbody = getElementByXpath('/html/body/div/div[6]/div[2]/div[2]/div/div[2]/table/tbody');

	for(var i = 0; i < tbody.rows.length; i++){
	    enableTranslationForRow(tbody.rows[i]);
	}
}

function formatarNomeArquivo(arquivo, sequencia) {
	return arquivo.substr(0,arquivo.length-4) + '_' + sequencia + ".mp3";
}


function listarTraducoes() {
	var traducoes = [];
	var nrows = tbody.rows.length
	for (var i = 0; i < nrows; i++) {
		var text = '//*[@id=\"span-' + i + '\"]';
		var element = getElementByXpath(text);
		var original = element.innerHTML.trim();
		element = getElementByXpath('//*[@id=\"listentran-0-' + i + '\"]')
		var translation = element.innerHTML.trim();
		traducoes[i] = original + ';' + translation;
	}
	return traducoes;
}


function listarComandosAudio(arquivo) {
	var nomesArquivos = [];
	for (var i = 1; i<timeStop.length; i++){
		console.log ('ffmpeg.exe -i '+ arquivo + ' -ab 320k -ac 2 -ar 44100 -vn -ss '+ timeStop[i-1] +' -t '+ (timeStop[i]-timeStop[i-1]) +' '+formatarNomeArquivo(arquivo, i));
		nomesArquivos[i-1] = formatarNomeArquivo(arquivo, i);
	}
	console.log ('ffmpeg.exe -i '+ arquivo + ' -ab 320k -ac 2 -ar 44100 -vn -ss '+ timeStop[timeStop.length-1] +' ' +formatarNomeArquivo(arquivo, timeStop.length));
	nomesArquivos[timeStop.length-1] = formatarNomeArquivo(arquivo, timeStop.length);
	return nomesArquivos;
}

function mergeTraducoesAndAudios() {
	var linhaCsv = [];
	for (var i = 0; i < traducoes.length; i++ ){
		linhaCsv[i] = traducoes[i] + ';' + '[sound:' + nomesArquivos[i] + '];' + fileName.substr(0,fileName.length-4);
		console.log(linhaCsv[i]);
	}
}


showLabels()
var traducoes = listarTraducoes()
var fileName = downloadURI(getAudioUrl())
var nomesArquivos = listarComandosAudio(fileName);
mergeTraducoesAndAudios();