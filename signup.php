<html lang='de'>
<head>
  <link rel="icon" href="../favicon.ico">
  <link rel='stylesheet' href='../css/main.css'>
  <title>Sign Up - MyGamesList</title>
</head>
<body>
<!--  Database Connection  -->
<?php
//Create Connection
$connection = null;
include "connection.php";
//Gallery Entry Limit
$galleryLimit = 10;
?>
<!--  Database Connection End -->


<div class="container">
  <!--  Hotbar  -->
  <?php include "hotbar.php" ?>

  <p class="titlebar">
    Sign Up
  </p>
  <!--  Hotbar End  -->


  <div class="content_box">

    <div class="mainbox" style="width: 1070px; height: 99%; overflow: hidden">
      <div class="loginBox">
        <form action="signup.php" method="post">
          <h3>Neuen Account erstellen</h3>
          <h5>Benutzername</h5>
          <input name="username" maxlength="16" type="text">
          <h5>Passwort</h5>
          <input name="password" maxlength="16" type="password">
          <button name="signup" type="submit">Sign Up</button>
        </form>

        <?php
        if ($_POST["username"] || $_POST["password"] || $_POST["submit"] || $_POST["signup"]) {
          $usernameInput = $_POST["username"];
          $passwordInput = $_POST["password"];
          $signupBtn = $_POST["signup"];

          if ($usernameInput || $passwordInput || $signupBtn) {
            $stmt = $connection->query("SELECT username, password, uNo FROM user WHERE username = '$usernameInput'");
            while ($rows = $stmt->fetch()) {
              $dbUsername = $rows[0];
              $dbPassword = $rows[1];
              $uNo = $rows[2];
            }
            if (!$dbUsername) {
              $passwordHash = password_hash($passwordInput, PASSWORD_DEFAULT);
              $stmt = $connection->query("INSERT INTO user (username, password) VALUES ('$usernameInput', '$passwordHash')");
              $stmt = $connection->query("SELECT username, password, uNo, LPAD(uNo, 7, '0') FROM user WHERE username = '$usernameInput'");
              while ($rows = $stmt->fetch()) {
                $dbUsername = $rows[0];
                $dbPassword = $rows[1];
                $uNo = $rows[2];
                $uNoPad = $rows[3];
              }
              if ($dbUsername && $dbPassword) {
                $_SESSION['userid'] = $uNo;
                $_SESSION['username'] = $dbUsername;
                $_SESSION['userpassword'] = $dbPassword;
                $_SESSION['useridpadded'] = $uNoPad;


                copy("lists/userList.php", "lists/$uNoPad.php");

                echo '<div style="margin-left: 20px; margin-right: 20px; text-align: center; border-top: 1px solid rebeccapurple; border-bottom: 1px solid rebeccapurple; padding: 10px; background-color: lavender">Account erfolgreich erstellt</div>';
                header("Refresh:0; url=home.php");
              } else {
                echo '<div style="margin-left: 20px; margin-right: 20px; text-align: center; border-top: 1px solid darkred; border-bottom: 1px solid darkred; padding: 10px; background-color: mistyrose">Fehler beim Erstellen des Accounts</div>';
              }
            } else {
              echo '<div style="margin-left: 20px; margin-right: 20px; text-align: center; border-top: 1px solid darkred; border-bottom: 1px solid darkred; padding: 10px; background-color: mistyrose">Account existiert bereits</div>';
            }
          }
        }
        ?>

      </div>
    </div>


  </div>
</div>

</body>

</html>
