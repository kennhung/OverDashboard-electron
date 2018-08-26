var RobotCom = false;

NetworkTables.addRobotConnectionListener(function(connected) {
  console.log("Robot connected: " + connected);
  RobotCom = connected;
  updateCommStat();
}, true);

function updateCommStat() {
  if ( RobotCom) {
    $("#com-stat").attr('class', "badge badge-success badge-pill");
    $("#com-stat").html("Connected");
  } else {
    $("#com-stat").attr('class',"badge badge-warning");
    $("#com-stat").html("Disconnected");
  }
  updateModeStat();
}

NetworkTables.putValue("/SmartDashboard/NT/ping", -1);
NetworkTables.putValue("/SmartDashboard/NT/ip", "noConnect");

NetworkTables.addKeyListener("/SmartDashboard/NT/ping", function(key, value, isNew) {
  $("#ptime").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/NT/ip", function(key, value, isNew) {
  $("#ntip").html(value);
});

var fmsAtt = false;
var robotMode = -1;

NetworkTables.addKeyListener("/SmartDashboard/ds/isFMSAtt", function(key, value, isNew) {
  fmsAtt = value;
  updateModeStat();
}, true);

NetworkTables.addKeyListener("/SmartDashboard/ds/mode", function(key, value, isNew) {
  robotMode = value;
  updateModeStat();
}, true);

NetworkTables.addKeyListener("/SmartDashboard/ds/matchTime", function(key, value, isNew) {
  $("#mtime").html(value);
}, true);

function updateModeStat(){
  var out = "";
  var classSet = "badge badge-pill ";
  if(RobotCom){
    out += robotMode;
    switch (robotMode) {
      case 1:
        out = "Auto";
        classSet += "badge-warning";
        break;
      case 2:
        out = "Teleop";
        classSet += "badge-warning";
        break;
      case 3:
        out = "Test";
        classSet += "badge-warning";
        break;
      case 0:
        out = "Disable";
        classSet += "badge-success";
        break;
      default:
        out = "Unknow";
        classSet += "badge-secondary";
    }

    if(fmsAtt){
      out += " FMS";
      classSet = "badge badge-pill badge-info";
    }
  }
  else{
    classSet = "badge badge-pill badge-danger";
    out = "N/A"
  }

  $("#mode-stat").attr('class',classSet);
  $("#mode-stat").html(out);
}
// Connection Stat above
//

//global
NetworkTables.addGlobalListener(function(key, value, isNew) {
  if(key.split('/')[1] == "SmartDashboard" || false){
    console.log(key, " ", value);
  }
}, true);

//System Info
NetworkTables.addKeyListener("/LiveWindow/Ungrouped/PowerDistributionPanel[1]/Voltage", function(key, value, isNew) {
  setValtBar("battV",value);
  $("#battV").html(value+" V");
}, true);

//Part Stat
NetworkTables.addKeyListener("/SmartDashboard/drive/status", function(key, value, isNew) {
  translateStatus("driveReady",value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/Up/status", function(key, value, isNew) {
  translateStatus("upReady",value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/Cube/status", function(key, value, isNew) {
  translateStatus("cubeReady",value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/Climb/status", function(key, value, isNew) {
  translateStatus("climbReady",value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/Gyro/status", function(key, value, isNew) {
  translateStatus("gyroReady",value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/AutoEngine/status", function(key, value, isNew) {
  translateStatus("autoEngingReady",value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/pdp/status", function(key, value, isNew) {
  translateStatus("pdpReady",value);
}, true);


//FMS
NetworkTables.addKeyListener("/FMSInfo/EventName", function(key, value, isNew) {
  $("#event").html(value);
}, true);

NetworkTables.addKeyListener("/FMSInfo/MatchNumber", function(key, value, isNew) {
  $("#match").html(value);
}, true);

NetworkTables.addKeyListener("/FMSInfo/StationNumber", function(key, value, isNew) {
  $("#station").html(value);
}, true);


//
//
//Auto settings
NetworkTables.addKeyListener("/SmartDashboard/autoDelay", function(key, value, isNew) {
  $("#autoDelay").val(value);
  delay = value;
  updateAutoMsg();
}, true);

$("#autoDelay").change(function() {
  if(isNaN($(this).val())){
    $(this).removeClass("is-valid");
    $(this).addClass("is-invalid");
  }
  else{
    $(this).removeClass("is-invalid");
    $(this).addClass("is-valid");
    NetworkTables.putValue("/SmartDashboard/autoDelay", parseInt($(this).val()));
    setTimeout(function() {
      $("#autoDelay").removeClass("is-valid");
    }, 1000);
  }
});

attachSelectToSendableChooser("#autoChoice","/SmartDashboard/Auto choices");
attachSelectToSendableChooser("#autoStation","/SmartDashboard/Auto point choices");

var autoPoint;
var autoChoices;
var delay;

NetworkTables.addKeyListener("/SmartDashboard/Auto point choices/selected", function(key, value, isNew) {
  autoPoint = value;
  updateAutoMsg();
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Auto choices/selected", function(key, value, isNew) {
  autoChoices = value;
  updateAutoMsg();
}, true);

function updateAutoMsg(){
  $("#autoConfig").html("do "+autoChoices+" on "+autoPoint+" delay "+delay);
}


//Auto mode
NetworkTables.addKeyListener("/SmartDashboard/Target Angle", function(key, value, isNew) {
  $("#targetAngle").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Error Angle", function(key, value, isNew) {
  $("#errAngle").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/CurrentStep", function(key, value, isNew) {
  $("#autoStage").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Timer", function(key, value, isNew) {
  $("#autoTimer").html(value);
}, true);



//
//
//DriveBase
NetworkTables.addKeyListener("/SmartDashboard/drive/leftSpeed", function(key, value, isNew) {
  speedL.set(value);
  $("#speedL").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/drive/rightSpeed", function(key, value, isNew) {
  speedR.set(value);
  $("#speedR").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/drive/reverse", function(key, value, isNew) {
  if(value){
    $("#driveRev").addClass("active");
  }
  else{
    $("#driveRev").removeClass("active");
  }
}, true);

$("#driveRev").click(function(){
  var valKey = "/SmartDashboard/drive/reverse";
  NetworkTables.putValue(valKey, !NetworkTables.getValue(valKey));
});

//Up Ass
NetworkTables.addKeyListener("/SmartDashboard/Up/Enc", function(key, value, isNew) {
  setUpAssBar("upEncB", value);
  $("#upEnc").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Up/targetStep", function(key, value, isNew) {
  setUpAssBar("upTargetB", value);
  $("#upTarget").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Up/motorOutPut", function(key, value, isNew) {
  setPWMBar("upOutB", value);
  $("#upOut").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Up/HoldOverride", function(key, value, isNew) {
  if(value){
    $("#upInfo").html("Holding Override Active");
  }
  else{
    $("#upInfo").html("");
  }
}, true);

$("#upHoldOver").click(function() {
  var valKey = "/SmartDashboard/Up/HoldOverride";
  NetworkTables.putValue(valKey, !NetworkTables.getValue(valKey));
});

//Gyro
NetworkTables.addKeyListener("/SmartDashboard/Gyro/angle", function(key, value, isNew) {
  compassC.value = value;
  $("#compass").html(value);
}, true);

//Encoders

NetworkTables.addKeyListener("/SmartDashboard/Left Dis", function(key, value, isNew) {
  $("#lEnc").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Right Dis", function(key, value, isNew) {
  $("#rEnc").html(value);
}, true);

//SuckingAssembly

NetworkTables.addKeyListener("/SmartDashboard/Cube/current1", function(key, value, isNew) {
  setAmpBar("suckC1B", value, 30);
  $("#suckC1").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Cube/current2", function(key, value, isNew) {
  setAmpBar("suckC2B", value, 30);
  $("#suckC2").html(value);
}, true);

//ClimbAssembly

NetworkTables.addKeyListener("/SmartDashboard/Climb/ropeOut", function(key, value, isNew) {
  setPWMBar("climbRopeB", value);
  $("#climbRope").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Climb/HookOut", function(key, value, isNew) {
  setPWMBar("climbHookB", value);
  $("#climbHook").html(value);
}, true);





//Camera
var cam1URL = "axis-camera1.local";
var cam2URL = "axis-camera2.local";

$("#cam1Load").click(function(){
  $(this).hide();
  loadCameraOnConnect({
      container: '#cam1',
      port: 80,
      host:cam1URL,
      image_url: '/mjpg/video.mjpg',
      data_url: '/css/common.css',
      attrs: {
          width: 320,
          height: 240
      }
  });
});

$("#cam2Load").click(function(){
  $(this).hide();
  loadCameraOnConnect({
      container: '#cam2',
      port: 80,
      host:cam2URL,
      image_url: '/mjpg/video.mjpg',
      data_url: '/css/common.css',
      attrs: {
          width: 320,
          height: 240
      }
  });
});
