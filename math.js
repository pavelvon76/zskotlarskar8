window.onload=function() {
  zpracujNacteniStranky(); 
  playSound("poutnici_DespicableMe.mp3");
}

function hideAllElementsByClassName(className) {
    var x = document.getElementsByClassName(className);
    for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    }
}

function playSound(inFile) {
  var filepath = "data/audio/" + inFile;
  var audio = new Audio(filepath);
  // have to wait till the data are loaded
  audio.onloadeddata = function() {
    audio.play();
  }
  audio.load();
}

function tryToGoToNextStage(inTestValue,inSolution,next_task_id) {
  debugger;
  if (inTestValue == inSolution) {
    hideAllElementsByClassName("task_container");
    document.getElementById(next_task_id).style.display = "block";
    playSound("517778__samuelgremaud__hen-1.wav");
  } else {
    playSound("475734__dogwomble__rubber-chicken-1.wav");
  }
}

function zpracujNacteniStranky() {

  // výchozí akce
  nactiHTMLData('data/info.html','obsah');
     
  // př. volání http://127.0.0.1:5501/index.html?rocnik=6&tema=ukoly6.delitelnost
  const dotazNaWeb = window.location.search;  // získám celý řetězec dotazu
  const dotazParametry = new URLSearchParams(dotazNaWeb);  // z řetezce chci znát jen ty parametry, tj. vše za ?
  const rocnik = dotazParametry.get('rocnik')  // který ročník načíst do témat
  const tema = dotazParametry.get('tema')    // které téma otevřít

  if (rocnik == "6") { nactiHTMLData('data/temata6.html','temata');}
  if (rocnik == "7") { nactiHTMLData('data/temata7.html','temata');}
  if (rocnik == "8") { nactiHTMLData('data/temata8.html','temata');}
  if (rocnik == "9") { nactiHTMLData('data/temata9.html','temata');}

  if (tema != "") {
    nactiXMLUkolyData("data/" + tema +".xml",'obsah');
  }
}

function nactiHTMLData(inHTMLFile,inElementId) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(inElementId).innerHTML = this.responseText;
      }
  }
  xhttp.open("GET", inHTMLFile, true);
  xhttp.send();
}

function nactiXMLUkolyData(inXMLFile,inElementId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        nactiUkoly(this.responseText,inElementId);
        }
    }
    xhttp.open("GET", inXMLFile, true);
    xhttp.send();
  }

function nactiUkoly(xmlText, inElementId) {
  var x, i, xmlDoc, txt;
  debugger;
  parser = new DOMParser;
  xmlDoc = parser.parseFromString(xmlText,"text/xml");
  txt = "";
    x = xmlDoc.getElementsByTagName("ukol");

  // pro každý úkol
  for (i = 0; i< x.length; i++) {
    txt += "<div class='task'>";

    // onclick=\"hideAllElementsByClassName(\'task_container\');this.nextElementSibling.style=\'display:block\'\"
    txt += "<section class='task_header'>";
    txt += "<div class='task_header_desc'>" +  x[i].getAttribute("nadpis") + "</div>";
    txt += "<div class='task_level' level='" + x[i].getAttribute("uroven") +  "'>" + x[i].getAttribute("uroven") + "</div>";
    txt += "<div class='task_points'>" + x[i].getAttribute("body") + "</div>";
    txt += "</section>";
  
      txt += "<div class='task_container' id='" + x[i].getAttribute("id") + "'>";
          txt += "<section class='task_description'>";
            txt +=  x[i].getElementsByTagName("ukol_zadani")[0].innerHTML;
          txt += "</section>"; // ukol_zadani

          // projdi všechny nápovědy
          napovedy = x[i].getElementsByTagName("ukol_napoveda");
          var h;
          for (h = 0; h< napovedy.length; h++) {
              txt +=  "<section class='task_help'>";
                txt += "<div help_points=" + napovedy[h].getAttribute("body_dolu") + " task_id=" + x[i].getAttribute("id") + " onclick=\"this.nextElementSibling.style=\'display:block\';this.style=\'display:none\'\">Ukaž " +  h + ". nápovědu:</div>";
                  txt += "<div class='task_help_line'>";
                    txt += napovedy[h].getElementsByTagName("ukol_napoveda_obsah")[0].innerHTML;       
                  txt += "</div>"; // task help line
              txt += "</section>";
          }

          // element odpovědi a řešení 
          debugger
          txt += "<section class=\"task_answer\" task_id=\""+ x[i].getAttribute("id") + "\" task_points=\"" + x[i].getAttribute("body") + "\" next_task_id=\"" + x[i].getAttribute("dalsiukolid") + "\" task_answer1=\"" + x[i].getAttribute("reseni_A") + "\">"
          
          // příklad Odpověď: 12 malířů vymaluje tuto halu za %1 hodin.
          // pěkná prasárnička :) vnořená změna... ((text.replace %1).replace %2) ...
          txt += x[i].getElementsByTagName("ukol_odpoved_zaka")[0].innerHTML.replace("%1","<input type=text id=\"task_answer"+ x[i].getAttribute("id") + "\" size=1 title=\"Zadejte výsledek\"/>");   
          
          txt += "<button class=\"task_check_btn\" onclick=\"tryToGoToNextStage(this.parentNode.getAttribute('task_answer1'),document.getElementById('task_answer"+ x[i].getAttribute("id") + "').value,this.parentNode.getAttribute('next_task_id'));\">Zkontroluj</button>";
          // txt += "<div class=\"task_solution\" style=\"display: none;\">";
          //    txt += x[i].getElementsByTagName("ukol_reseni")[0].innerHTML;
          txt += "</section>"; // task_answer 

      txt += "</div>"; // task container

    txt += "</div>";  // task element

  }
  document.getElementById(inElementId).innerHTML = txt;
}
