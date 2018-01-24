characters = [
{
  "id"      : 0,
  "name"    : "Bulbasaur",
  "hp"      : 100,
  "damage"  : 12,
  "dmgInc"  : 12,
  "avatar"  : "./assets/images/bulbasaur.png"
},
{
  "id"      : 1,
  "name"    : "Charmander",
  "hp"      : 110,
  "damage"  : 10,
  "dmgInc"  : 8,
  "avatar"  : "./assets/images/charmander.png"
},
{
  "id"      : 2,
  "name"    : "Squirtle",
  "hp"      : 130,
  "damage"  : 11,
  "dmgInc"  : 8,
  "avatar"  : "./assets/images/squirtle.png"
},
{
  "id"      : 3,
  "name"    : "Pikachu",
  "hp"      : 180,
  "damage"  : 18,
  "dmgInc"  : 5,
  "avatar"  : "./assets/images/pikachu.png"
}
];


var player;

var opponent;

var damageBoost = 20;



var state = "choosePlayer";
var curScreen;

function instruct(s) {
  $("#instructions").text(s);
}

function stateSwitcher(s, w) {
  if(s==="attack") {
    state = "attack";
    renderArena();
    transTo("screen1");
  } else if (s==="chooseOpp") {
    state = "chooseOpp";
    transTo("screen0");
  } else if (s==="gameOver") {
    renderGameOver(w);
    state = "gameOver";
    transTo("screen2");
  }
  console.log("Current state: "+state);
}

function renderCards(){
  for(var i=0; i < characters.length; i++) {
    var card = $("<div>");
    var avatar = "<img src='"+characters[i].avatar+"'>";
    var name = "<h3>"+characters[i].name+"</h3>";
    var hp = "<h4 class='hp'>"+characters[i].hp+" HP</h4>";
    card.addClass("card");
    card.attr("id", i);
    card.html(name);
    card.append(avatar);
    card.append(hp);
    $("#characters").append(card);
  }
}

function renderArena() {
  $("#arena #status").empty();
  if ($("#duel .player").length === 0) {
    $("#characters #"+player.id).clone().appendTo("#duel");
  }
  if ($("#duel .opponent").length === 0) {
    $("#characters #"+opponent.id).clone().appendTo("#duel");
  } else {
    $("#duel .opponent").replaceWith($("#characters #"+opponent.id).clone());
  }
  $("#attack").removeClass("disabled");
  console.log("Arena rendered");
}

function renderGameOver(w) {
  if ($("#showcase .card").length===0) {
    $("#characters #"+player.id).clone().appendTo("#showcase");
  }
  if(w) {
    $("#showcase h4.hp").text("WINNER!");
    $("#gameOver #message").html("You defeated everyone. You win!");
  } else {
    $("#gameOver #message").html("You were defeated by " + opponent.name + ". Try again.");
  }
  console.log("Game Over rendered");
}

function chooseCharacter(c){
  var id = $(c).attr("id");
  if (state === "choosePlayer") {
    player = "";
    player = characters[id];

    $(c).addClass("disable player");
    console.log("You chose " + player.name);

    stateSwitcher("chooseOpp");
    instruct("Choose your opponent");
  } else if (state === "chooseOpp") {
    opponent = characters[id];

    $(c).addClass("disable opponent");
    console.log("For your opponent, you chose " + opponent.name);

    stateSwitcher("attack");
  }
}

function transTo(t) {
  if(curScreen !== t) {
    console.log("Transitioning to " + t);
    $("html, body").animate({
        scrollTop: $("#"+t).offset().top
    }, 1000, "easeInOutCubic", function(){
      console.log("Transition complete");
    });
  }
  curScreen = t;

}

function attack() {
  if(state === "attack") {

    opponent.hp = opponent.hp - player.damage;
    player.hp = player.hp - opponent.damage;

    if (player.hp > 0) {
      $(".player .hp").html(player.hp + " HP");
    } else {
      $(".player .hp").text("DEFEATED");
    }
    if (opponent.hp > 0) {
      $(".opponent .hp").html(opponent.hp + " HP");
    } else {
      $(".opponent .hp").text("DEFEATED");
    }
    $("#arena #status").html("You attacked for "+player.damage+" damage.<br>");
    $("#arena #status").append(opponent.name +" attacked for "+opponent.damage+" damage.");

    player.damage += player.dmgInc;

    if(opponent.hp <= 0) {
      roundVictory();
    } else if (player.hp <= 0) {
      gameLose();
    }
  }

}

function roundVictory() {

  player.damage += damageBoost;
  $("#arena #status").append("<br>You defeated "+opponent.name + "!");

  $("#characters .opponent").addClass("defeated");

  $("#attack").addClass("disabled");

  $("#duel .opponent").animate({
      opacity: 0
  }, 1000, "easeInOutCubic", function(){
    console.log("Fade out complete");

    console.log("Number of disabled cards: " + $("#characters .disable").length);
    if($("#characters .disable").length===characters.length) {
      console.log("There are no more opponents.");
      gameWin();
    } else {
      console.log("There are more opponents to duel.");
      stateSwitcher("chooseOpp");
    }
  });

}

function gameLose() {
  console.log("You died. Game over.");
  stateSwitcher("gameOver", false);
}

function gameWin() {
  console.log("You win!");
  stateSwitcher("gameOver", true);
}

$(document).ready(function(){

  transTo("screen0");
  renderCards();


  $("#wrap").fadeIn( "slow", function() {

    $("#loader").css("display", "none");
  });

  $(".card").click(function(){
    chooseCharacter(this);
  });

  $("#attack").click(function(){
    attack();
  });

  $("#reset").click(function(){
    $("html, body").fadeOut( "slow", function() {
      location.reload();
    });
  });

});