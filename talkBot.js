var Food = ['돈까스', '라면', '치킨', '피자', '햄버거', '짜장면', '짬뽕', '굶어', '초밥', '제육볶음', '연어장덮밥', '프렌치토스트', '아이스아메리카노', '서브웨이', '뼈다귀해장국', '감자탕', '참치새싹비빔밥', '불백', '등뼈찜', '김치찜', '아구찜', '대구뽈찜', '계란만두', '밀면', '냉면', '들깨칼국수', '들깨수제비', '김치수제비', '보리밥', '녹두전', '해물파전', '샤브샤브','치킨마요덮밥', '떡국', '연어덮밥', '만둣국', '김치볶음밥', '밥버거', '샌드위치', '갈비찜', '깐풍만두', '월남쌈', ' 순두부찌개', '떡볶이', '라볶이', '순대', '보쌈', '족발', '추어탕', '갈비탕', '설렁탕', '마라탕', '김밥', '찜닭', '깐풍기', '탕수육', '타코야끼', '양꼬치', '쌀국수', '튀김', '텐동', '죽', '카레', '주먹밥', '파스타', '빵']; // '/메뉴' 음식 리스트

let today = new Date();
var day = today.getDay();
var hour = today.getHours();

response = (room, msg, sender, isGroupChat, replier) => {

  var cmd = msg.split(" ");

  if(day==3&&(hour>=6||hour<=9)){ //로스트아크 정기 점검시간
    replier.reply("🛠️서버 점검 중 입니다🛠️");
  }

  if (cmd[0] == "/도움말" || cmd[0] == "/help") {
    replier.reply("/정보 닉네임 \n/부캐 닉네임 \n/장비 닉네임 \n/보석 닉네임 \n/팔찌 닉네임 \n/내실 닉네임 \n/메뉴 \n/도비스 \n/도가토 ");
  }


  if (cmd[0] == "/정보") {
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/armories/characters/" + cmd[1]).ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();
    
    var info = JSON.parse(data).ArmoryProfile;

    var job = info.CharacterClassName;
    var server = info.ServerName;
    var charLv = info.CharacterLevel;
    var itemLv = info.ItemMaxLevel;
    var expLv = info.ExpeditionLevel;
    var title = info.Title;

    if (title == null){
      title = "-";
    }

    var guild = info.GuildName;

    if (guild == null){
        guild = "-";
    }

    var pvp = info.PvpGradeName;

    var result = title + cmd[1] +
      "\n직업 : " + job +
      "\n서버 : " + server +
      "\n전투 레벨 : " + charLv +
      "\n원정대 레벨 : " + expLv +
      "\n무기 레벨 : " + itemLv +
      "\nPVP : " + pvp +
      "\n길드 : " + guild;

    replier.reply("[로스트아크 캐릭터 정보]\n\n" + result);
  }


  if (cmd[0] == "/부캐") {
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/characters/" + cmd[1]+"/siblings").ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();

    var character = JSON.parse(data);
    
    var result = "\n" + character[0].ServerName + "\n\n";
    var server = character[0].ServerName;
    var count = character.length;
    
    var i = 0;
    
    for(i = 0; i < count; i++){
      if(server!=character[i].ServerName){
        result += "\n" + character[i].ServerName + "\n\n";
        server = character[i].ServerName;
      }
      result += character[i].ItemMaxLevel + " " + character[i].CharacterClassName + " " + character[i].CharacterName+ "\n";
    }

    replier.reply("보유 캐릭터 : "+ count + "\n" + result);
  }
  
  if (cmd[0] == "/장비") {
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/armories/characters/" + cmd[1]+"/equipment").ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();
    
    var armor = JSON.parse(data);
    
    var quality = null;
    var result = cmd[1]+"의 장비\n\n";
    
    for(var i = 0 ; i < 6; i++){
      quality = JSON.parse(armor[i].Tooltip);
      
      var newquality = quality.Element_001;
      quality = newquality.value.qualityValue;
      
      result += "품질 " + quality + " " + armor[i].Type + " : " + armor[i].Grade + " " + armor[i].Name + "\n";
    }

    replier.reply(result); 
  }
  
  if (cmd[0] == "/쌀산기"){
    var price = cmd[1] * 0.95;
    
    var result4 = (price * 0.75).toFixed(0);
    var result8 = (price * 0.875).toFixed(0);
    
    var result = "-쌀-     산기\n\n4인 입찰가 : " + result4 + "\n8인 입찰가 : " + result8;
    
    replier.reply(result);
  }
  
  if (cmd[0] == "/팔찌"){
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/armories/characters/" + cmd[1]+"/equipment").ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();
    
    var braceinfo = JSON.parse(data);
    
    var brace = JSON.parse(braceinfo[12].Tooltip); 
    var brace01 = brace.Element_004;
    var brace02 = brace01.value;

    var result = braceinfo[12].Name + "\n\n" + brace02.Element_001;  
    
    replier.reply(result);
  }
  
  if (cmd[0] == "/보석"){
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/armories/characters/" + cmd[1] + "/gems").ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();

    var gems = JSON.parse(data);
    
    var i = 0;
    var result = null;
    
    for(i = 0; i < gems.Gems.length; i++){
      var gemsInfo = JSON.parse(gems.Gems[i].Tooltip);
      var gemName = gemsInfo.Element_000.value;
      var check = gemName.split("석");
 
      if(check[1]==" (귀속) "){
        var gemSkillval = gemsInfo.Element_005.value;
        var gemSkill = gemSkillval.Element_001;  
      }
      
      else{
      var gemSkillval = gemsInfo.Element_004.value;
      var gemSkill = gemSkillval.Element_001;
      }

      if(i==0){
        result = gemName + " " + gemSkill + "\n";     
      }

      else{
        result += gemName + " " + gemSkill + "\n";   
      }
    }

    replier.reply(cmd[1] + "의 보석\n\n" + result);
  }
  
  if (cmd[0] == "/이벤트"){
    var data = org.jsoup.Jsoup.connect("https://lostark.game.onstove.com/Profile/Character/" + cmd[1]).get();
    
    var eventList = data.select("div.swiper-container");
    
    while(true){
      
    }
    
    replier.reply(eventList);
    
  }
  
  if (cmd[0] == "/내실"){
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/armories/characters/" + cmd[1]+"/collectibles").ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();
    
    var collection = JSON.parse(data);
    
    var result = cmd[1]+"의 내실\n\n";

    for(var i = 0 ; i < 9; i++){
      result += collection[i].Type + " : " + collection[i].Point + "/" + collection[i].MaxPoint+"\n";
    }
    
    replier.reply(result); 
  }

  if (cmd[0] == "/도비스"){
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/gamecontents/challenge-abyss-dungeons").ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();
    
    var dobyss = JSON.parse(data);

    var result = "이번주 도전 어비스 던전\n\n";
    
    for(var i = 0 ; i < 2; i++){
      result += dobyss[i].Name+"\n"; 
    }

    replier.reply(result); 
  }

  if (cmd[0] == "/도가토"){
    var data = org.jsoup.Jsoup.connect("https://developer-lostark.game.onstove.com/gamecontents/challenge-guardian-raids").ignoreContentType(true).header("authorization","bearer "+apiKey).get().select("body").text();
    
    var dogato = JSON.parse(data);
    
    var result = "이번주 도전 가디언 토벌\n\n";
    
    for(var i = 0 ; i < 3; i++){
      result += dogato.Raids[i].Name+"\n"; 
    }

    replier.reply(result); 
  }
  

  if (cmd[0] == "/메뉴") {
    var randNum = Math.floor(Math.random() * Food.length);

    replier.reply(Food[randNum]);
  }
}