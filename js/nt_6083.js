// Read & send data from NetworkTable.

var RobotCom = false;
var fmsAtt = false;
var robotMode = -1;

// For the robot mode status in the top.
function updateModeStat() {
  var out = "";
  var classSet = "badge badge-pill ";
  if (RobotCom) {
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

    if (fmsAtt) {
      out += " FMS";
      classSet = "badge badge-pill badge-info";
    }
  }
  else {
    classSet = "badge badge-pill badge-danger";
    out = "N/A"
  }

  $("#mode-stat").attr('class', classSet);
  $("#mode-stat").html(out);
}

// For the communication status in the top.
function updateCommStat() {
  if (RobotCom) {
    $("#com-stat").attr('class', "badge badge-success badge-pill");
    $("#com-stat").html("Connected");
  } else {
    $("#com-stat").attr('class', "badge badge-warning");
    $("#com-stat").html("Disconnected");
  }
  updateModeStat();
}

// Update the commstatus when robot connect or disconnect.
NetworkTables.addRobotConnectionListener(function (connected) {
  console.log("Robot connected: " + connected);
  RobotCom = connected;
  updateCommStat();
}, true);

updateCommStat(); 

// Init ping and ip field.
NetworkTables.putValue("/SmartDashboard/NT/ping", -1);
NetworkTables.putValue("/SmartDashboard/NT/ip", "noConnect");

// Read robot ping.
NetworkTables.addKeyListener("/SmartDashboard/NT/ping", function (key, value, isNew) {
  $("#ptime").html(value);
}, true);

// Read robot ip.
NetworkTables.addKeyListener("/SmartDashboard/NT/ip", function (key, value, isNew) {
  $("#ntip").html(value);
});

NetworkTables.addKeyListener("/SmartDashboard/ds/isFMSAtt", function (key, value, isNew) {
  fmsAtt = value;
  updateModeStat();
}, true);

NetworkTables.addKeyListener("/SmartDashboard/ds/mode", function (key, value, isNew) {
  robotMode = value;
  updateModeStat();
}, true);

NetworkTables.addKeyListener("/SmartDashboard/ds/matchTime", function (key, value, isNew) {
  $("#mtime").html(value);
}, true);

// Connection stuff above
//

// Global listener
NetworkTables.addGlobalListener(function (key, value, isNew) {
  if (key.split('/')[1] == "SmartDashboard" || false) {
    console.log(key, " ", value);
  }
}, true);

//System Info
NetworkTables.addKeyListener("/LiveWindow/Ungrouped/PowerDistributionPanel[1]/Voltage", function (key, value, isNew) {
  setValtBar("battV", value);
  $("#battV").html(value + " V");
}, true);

//Sub system status
NetworkTables.addKeyListener("/SmartDashboard/drive/status", function (key, value, isNew) {
  translateStatus("driveReady", value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/up/status", function (key, value, isNew) {
  translateStatus("upReady", value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/shoot/status", function (key, value, isNew) {
  translateStatus("shootReady", value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/hatch/status", function (key, value, isNew) {
  translateStatus("hatchReady", value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/SensorHub/status", function (key, value, isNew) {
  translateStatus("sensorReady", value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/AutoEngine/status", function (key, value, isNew) {
  translateStatus("autoEngingReady", value);
}, true);
NetworkTables.addKeyListener("/SmartDashboard/pdp/status", function (key, value, isNew) {
  translateStatus("pdpReady", value);
}, true);


// Read match data from FSM.
NetworkTables.addKeyListener("/FMSInfo/EventName", function (key, value, isNew) {
  $("#event").html(value);
}, true);

NetworkTables.addKeyListener("/FMSInfo/MatchNumber", function (key, value, isNew) {
  $("#match").html(value);
}, true);

NetworkTables.addKeyListener("/FMSInfo/StationNumber", function (key, value, isNew) {
  $("#station").html(value);
}, true);


//
//
//Auto settings
var autoPoint;
var autoChoices;
var delay;

function updateAutoMsg() {
  $("#autoConfig").html("do " + autoChoices + " on " + autoPoint + " delay " + delay);
}

NetworkTables.addKeyListener("/SmartDashboard/autoDelay", function (key, value, isNew) {
  $("#autoDelay").val(value);
  delay = value;
  updateAutoMsg();
}, true);

$("#autoDelay").change(function () {
  if (isNaN($(this).val())) {
    $(this).removeClass("is-valid");
    $(this).addClass("is-invalid");
  }
  else {
    $(this).removeClass("is-invalid");
    $(this).addClass("is-valid");
    NetworkTables.putValue("/SmartDashboard/autoDelay", parseInt($(this).val()));
    setTimeout(function () {
      $("#autoDelay").removeClass("is-valid");
    }, 1000);
  }
});

attachSelectToSendableChooser("#autoChoice", "/SmartDashboard/Auto choices");
attachSelectToSendableChooser("#autoStation", "/SmartDashboard/Auto point choices");

NetworkTables.addKeyListener("/SmartDashboard/Auto point choices/selected", function (key, value, isNew) {
  autoPoint = value;
  updateAutoMsg();
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Auto choices/selected", function (key, value, isNew) {
  autoChoices = value;
  updateAutoMsg();
}, true);


//Auto mode
NetworkTables.addKeyListener("/SmartDashboard/Target Angle", function (key, value, isNew) {
  $("#targetAngle").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Error Angle", function (key, value, isNew) {
  $("#errAngle").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/CurrentStep", function (key, value, isNew) {
  $("#autoStage").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/Timer", function (key, value, isNew) {
  $("#autoTimer").html(value);
}, true);



//
//
//DriveBase
NetworkTables.addKeyListener("/SmartDashboard/drive/leftSpeed", function (key, value, isNew) {
  speedL.set(value);
  $("#speedL").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/drive/rightSpeed", function (key, value, isNew) {
  speedR.set(value);
  $("#speedR").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/drive/reverse", function (key, value, isNew) {
  if (value) {
    $("#driveRev").addClass("active");
  }
  else {
    $("#driveRev").removeClass("active");
  }
}, true);

$("#driveRev").click(function () {
  var valKey = "/SmartDashboard/drive/reverse";
  NetworkTables.putValue(valKey, !NetworkTables.getValue(valKey));
});

//Up Ass
NetworkTables.addKeyListener("/SmartDashboard/up/enc", function (key, value, isNew) {
  setUpAssBar("upEncB", value);
  $("#upEnc").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/up/targetStep", function (key, value, isNew) {
  setUpAssBar("upTargetB", value);
  $("#upTarget").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/up/motorOut", function (key, value, isNew) {
  setPWMBar("upOutB", value);
  $("#upOut").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/up/holdingOverride", function (key, value, isNew) {
  if (value) {
    $("#upHoldOver").addClass("active");
  }
  else {
    $("#upHoldOver").removeClass("active");
  }
}, true);

$("#upHoldOver").click(function () {
  var valKey = "/SmartDashboard/up/holdingOverride";
  NetworkTables.putValue(valKey, !NetworkTables.getValue(valKey));
});

//SensorHub
NetworkTables.addKeyListener("/SmartDashboard/SensorHub/heading", function (key, value, isNew) {
  compassC.value = value;
  $("#compass").html(value);
}, true);

//Drive Enc
NetworkTables.addKeyListener("/SmartDashboard/drive/leftDis", function (key, value, isNew) {
  $("#lEnc").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/drive/rightDis", function (key, value, isNew) {
  $("#rEnc").html(value);
}, true);

//ShootingAssembly
NetworkTables.addKeyListener("/SmartDashboard/shoot/currentLeft", function (key, value, isNew) {
  setAmpBar("shootClB", value, 30);
  $("#shootCl").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/shoot/currentRight", function (key, value, isNew) {
  setAmpBar("shootCrB", value, 30);
  $("#shootCr").html(value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/shoot/target", function (key, value, isNew) {
  $("#shooterAngle").html(value);
});

NetworkTables.addKeyListener("/SmartDashboard/shoot/enc", function (key, value, isNew) {
  $("#shooterCurrentAngle").html(value);
});

NetworkTables.addKeyListener("/SmartDashboard/shoot/angleMotorOut", function (key, value, isNew) {
  $("#angleMotorOut").html(value);
  setPWMBar("angleMotorOutB", value);
});

NetworkTables.addKeyListener("/SmartDashboard/shoot/holdingOverride", function (key, value, isNew) {
  if (value) {
    $("#shootHoldOver").addClass("active");
  } else {
    $("#shootHoldOver").removeClass("active")
  }
});

$("#shootHoldOver").click(function () {
  var valKey = "/SmartDashboard/shoot/holdingOverride";
  NetworkTables.putValue(valKey, !NetworkTables.getValue(valKey));
});


//Panel Assembly

NetworkTables.addKeyListener("/SmartDashboard/panel/hatch", function (key, value, isNew) {
  if (value) {
    $("#hatch").removeClass("badge-light");
    $("#hatch").addClass("badge-success");
  } else {
    $("#hatch").removeClass("badge-success");
    $("#hatch").addClass("badge-light");
  }
}, true);

NetworkTables.addKeyListener("/SmartDashboard/panel/push", function (key, value, isNew) {
  if (value) {
    $("#push").addClass("badge-success");
  } else {
    $("#push").removeClass("badge-success");
  }
}, true);

NetworkTables.addKeyListener("/SmartDashboard/panel/protectOverride", function (key, value, isNew) {
  if (value) {
    $("#hatchOverride").addClass("active");
  } else {
    $("#hatchOverride").removeClass("active")
  }
});

$("#hatchOverride").click(function () {
  var valKey = "/SmartDashboard/panel/protectOverride";
  NetworkTables.putValue(valKey, !NetworkTables.getValue(valKey));
});

NetworkTables.addKeyListener("/SmartDashboard/panel/motorOut", function (key, value, isNew){
  $("#hatchMotor").html(value);
  setPWMBar("hatchMotorB", value);
});

//Pneumatic Assembly

NetworkTables.addKeyListener("/SmartDashboard/pneumatic/compPower", function (key, value, isNew) {
  setONOFF("compPower", value);
}, true);

NetworkTables.addKeyListener("/SmartDashboard/pneumatic/compCloseLoop", function (key, value, isNew) {
  if (value) {
    $("#compCloseLoop").addClass("active");
  }
  else {
    $("#compCloseLoop").removeClass("active");
  }
}, true);

$("#compCloseLoop").click(function () {
  var valKey = "/SmartDashboard/pneumatic/compCloseLoop";
  NetworkTables.putValue(valKey, !NetworkTables.getValue(valKey));
});


//Camera
var cam1URL = "10.14.56.2";
var cam2URL = "10.60.83.2";

$("#cam1Load").click(function () {
  $(this).hide();
  loadCameraOnConnect({
    container: '#cam1',
    port: 1181,
    host: cam1URL,
    image_url: '/stream.mjpg',
    data_url: '/settings.json',
    attrs: {
      width: 640,
      height: 480
    }
  });
});
