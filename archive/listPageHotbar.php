<div class="logo">
  <a href="../home.php">
    <img src="../../img/logo.png" width="400px">
  </a>
  <?php
  if (!$_SESSION['userid']) {
    echo "<a href='../login.php' style='float: right; color: white; background-color: rebeccapurple; padding: 10px; font-weight: bold; border-radius: 5px; margin: 10px; margin-top: 30px'>Login</a>";
  } else {
    echo "<a href='../logout.php' style='float: right; color: darkred; background-color: mistyrose; padding: 10px; font-weight: bold; border-radius: 5px; margin: 9px; margin-top: 30px'>Logout</a>";
  }
  ?>
</div>
