<?php
//Create Connection
$connection = null;
include "../connection.php";
//Gallery Entry Limit
?>

<html lang='de'>
<head>
  <link rel="icon" href="../../favicon.ico">
  <link rel='stylesheet' href='../../css/main.css'>
  <link rel='stylesheet' href='../../css/listPage.css'>
  <title><?php echo "$userName's Liste" ?></title>
</head>
<body>

<div class="container">
  <!--  Hotbar  -->
  <?php include "listPageHotbar.php" ?>

  <p class="titlebar">
    <?php echo "$userName's Liste" ?>
  </p>
  <!--  Hotbar End  -->


  <div class="content_box">
    <div class="mainbox" style="width: 1067px; height: auto; overflow: hidden">

      <div class="statusBar">
        <div class="statusBar-content">
          <form action="<?php echo $userIdPad?>.php" method="get">
            <button name="allEntries" type="submit">Alle Titel</button>
          </form>
        </div>
        <div class="statusBar-content">
          <form action="<?php echo $userIdPad?>.php" method="get">
            <button name="currentlyPlaying" type="submit">Am Spielen</button>
          </form>
        </div>
        <div class="statusBar-content">
          <form action="<?php echo $userIdPad?>.php" method="get">
            <button name="completed" type="submit">Abgeschlossen</button>
          </form>
        </div>
        <div class="statusBar-content">
          <form action="<?php echo $userIdPad?>.php" method="get">
            <button name="onHold" type="submit">On-Hold</button>
          </form>
        </div>
        <div class="statusBar-content">
          <form action="<?php echo $userIdPad?>.php" method="get">
            <button name="dropped" type="submit">Nicht fortgesetzt</button>
          </form>
        </div>
        <div class="statusBar-content">
          <form action="<?php echo $userIdPad?>.php" method="get">
            <button name="planned" type="submit">Geplant</button>
          </form>
        </div>
      </div>

      <table>
        <tr>
          <th style="width: 5px"> </th>
          <th style="width: 25px">#</th>
          <th style="width: 200px">Cover</th>
          <th style="width: 600px">Titel</th>
          <th style="width: 77px">Score</th>
          <th style="width: 150px">Plattform</th>
        </tr>

      <?php
      $statusColors = [2 => "limegreen", 3 => "steelblue", 4 => "gold", 5 => "darkred", 6 => "gray"];
      if (isset($_GET["allEntries"]) || isset($_GET["currentlyPlaying"]) || isset($_GET["completed"]) || isset($_GET["onHold"]) || isset($_GET["dropped"]) || isset($_GET["planned"])) {
        $allEntriesBtn = $_GET["allEntries"];
        $currentlyPlayingBtn = $_GET["currentlyPlaying"];
        $completedBtn = $_GET["completed"];
        $onHoldBtn = $_GET["onHold"];
        $droppedBtn = $_GET["dropped"];
        $plannedBtn = $_GET["planned"];

        if (isset($allEntriesBtn)) {
          $stmt = $connection->query("SELECT g.title, g.pagePath, g.imgCover, l.refStatus, p.name, p.pagePath, l.score FROM list l, user u, status s, game g, platform p WHERE l.refUser = $userId AND l.refUser = u.uNo AND l.refGame = g.gNo AND p.pNo = g.orgPlatform AND l.refStatus = s.statNo ORDER BY l.refStatus");
          while ($rows = $stmt->fetch()) {
            $i++;
            if ($rows[3] == 2) {
              $colorTag = "style='background-color: $statusColors[2]";
            } elseif ($rows[3] == 3) {
              $colorTag = "style='background-color: $statusColors[3]";
            } elseif ($rows[3] == 4) {
              $colorTag = "style='background-color: $statusColors[4]";
            } elseif ($rows[3] == 5) {
              $colorTag = "style='background-color: $statusColors[5]";
            } elseif ($rows[3] == 6) {
              $colorTag = "style='background-color: $statusColors[6]";
            }
            echo "
            <tr>
                <th><div $colorTag; height: 210px; width: 5px'></div></th>
                <th>$i</th>
                <th style='padding: 5px'><a href='../games/$rows[1]'><img alt='$rows[0]' src='../$rows[2]'></a></th>
                <th><a href='../games/$rows[1]'>$rows[0]</a></th>
                <th>$rows[6]</th>
                <th><a href='../platforms/$rows[5]'>$rows[4]</a></th>
            </tr>
            ";
          }
        } elseif (isset($currentlyPlayingBtn)) {
          $stmt = $connection->query("SELECT g.title, g.pagePath, g.imgCover, l.refStatus, p.name, p.pagePath, l.score FROM list l, user u, status s, game g, platform p WHERE l.refUser = $userId AND l.refUser = u.uNo AND l.refGame = g.gNo AND p.pNo = g.orgPlatform AND l.refStatus = s.statNo AND l.refStatus = 2 ORDER BY l.refStatus");
          while ($rows = $stmt->fetch()) {
            $i++;
            if ($rows[3] == 2) {
              $colorTag = "style='background-color: $statusColors[2]";
            } elseif ($rows[3] == 3) {
              $colorTag = "style='background-color: $statusColors[3]";
            } elseif ($rows[3] == 4) {
              $colorTag = "style='background-color: $statusColors[4]";
            } elseif ($rows[3] == 5) {
              $colorTag = "style='background-color: $statusColors[5]";
            } elseif ($rows[3] == 6) {
              $colorTag = "style='background-color: $statusColors[6]";
            }
            echo "
            <tr>
                <th><div $colorTag; height: 210px; width: 5px'></div></th>
                <th>$i</th>
                <th style='padding: 5px'><a href='../games/$rows[1]'><img alt='$rows[0]' src='../$rows[2]'></a></th>
                <th><a href='../games/$rows[1]'>$rows[0]</a></th>
                <th>$rows[6]</th>
                <th><a href='../platforms/$rows[5]'>$rows[4]</a></th>
            </tr>
            ";
          }
        } elseif (isset($completedBtn)) {
          $stmt = $connection->query("SELECT g.title, g.pagePath, g.imgCover, l.refStatus, p.name, p.pagePath, l.score FROM list l, user u, status s, game g, platform p WHERE l.refUser = $userId AND l.refUser = u.uNo AND l.refGame = g.gNo AND p.pNo = g.orgPlatform AND l.refStatus = s.statNo AND l.refStatus = 3 ORDER BY l.refStatus");
          while ($rows = $stmt->fetch()) {
            $i++;
            if ($rows[3] == 2) {
              $colorTag = "style='background-color: $statusColors[2]";
            } elseif ($rows[3] == 3) {
              $colorTag = "style='background-color: $statusColors[3]";
            } elseif ($rows[3] == 4) {
              $colorTag = "style='background-color: $statusColors[4]";
            } elseif ($rows[3] == 5) {
              $colorTag = "style='background-color: $statusColors[5]";
            } elseif ($rows[3] == 6) {
              $colorTag = "style='background-color: $statusColors[6]";
            }
            echo "
            <tr>
                <th><div $colorTag; height: 210px; width: 5px'></div></th>
                <th>$i</th>
                <th style='padding: 5px'><a href='../games/$rows[1]'><img alt='$rows[0]' src='../$rows[2]'></a></th>
                <th><a href='../games/$rows[1]'>$rows[0]</a></th>
                <th>$rows[6]</th>
                <th><a href='../platforms/$rows[5]'>$rows[4]</a></th>
            </tr>
            ";
          }
        } elseif (isset($onHoldBtn)) {
          $stmt = $connection->query("SELECT g.title, g.pagePath, g.imgCover, l.refStatus, p.name, p.pagePath, l.score FROM list l, user u, status s, game g, platform p WHERE l.refUser = $userId AND l.refUser = u.uNo AND l.refGame = g.gNo AND p.pNo = g.orgPlatform AND l.refStatus = s.statNo AND l.refStatus = 4 ORDER BY l.refStatus");
          while ($rows = $stmt->fetch()) {
            $i++;
            if ($rows[3] == 2) {
              $colorTag = "style='background-color: $statusColors[2]";
            } elseif ($rows[3] == 3) {
              $colorTag = "style='background-color: $statusColors[3]";
            } elseif ($rows[3] == 4) {
              $colorTag = "style='background-color: $statusColors[4]";
            } elseif ($rows[3] == 5) {
              $colorTag = "style='background-color: $statusColors[5]";
            } elseif ($rows[3] == 6) {
              $colorTag = "style='background-color: $statusColors[6]";
            }
            echo "
            <tr>
                <th><div $colorTag; height: 210px; width: 5px'></div></th>
                <th>$i</th>
                <th style='padding: 5px'><a href='../games/$rows[1]'><img alt='$rows[0]' src='../$rows[2]'></a></th>
                <th><a href='../games/$rows[1]'>$rows[0]</a></th>
                <th>$rows[6]</th>
                <th><a href='../platforms/$rows[5]'>$rows[4]</a></th>
            </tr>
            ";
          }
        } elseif (isset($droppedBtn)) {
          $stmt = $connection->query("SELECT g.title, g.pagePath, g.imgCover, l.refStatus, p.name, p.pagePath, l.score FROM list l, user u, status s, game g, platform p WHERE l.refUser = $userId AND l.refUser = u.uNo AND l.refGame = g.gNo AND p.pNo = g.orgPlatform AND l.refStatus = s.statNo AND l.refStatus = 5 ORDER BY l.refStatus");
          while ($rows = $stmt->fetch()) {
            $i++;
            if ($rows[3] == 2) {
              $colorTag = "style='background-color: $statusColors[2]";
            } elseif ($rows[3] == 3) {
              $colorTag = "style='background-color: $statusColors[3]";
            } elseif ($rows[3] == 4) {
              $colorTag = "style='background-color: $statusColors[4]";
            } elseif ($rows[3] == 5) {
              $colorTag = "style='background-color: $statusColors[5]";
            } elseif ($rows[3] == 6) {
              $colorTag = "style='background-color: $statusColors[6]";
            }
            echo "
            <tr>
                <th><div $colorTag; height: 210px; width: 5px'></div></th>
                <th>$i</th>
                <th style='padding: 5px'><a href='../games/$rows[1]'><img alt='$rows[0]'  src='../$rows[2]'></a></th>
                <th><a href='../games/$rows[1]'>$rows[0]</a></th>
                <th>$rows[6]</th>
                <th><a href='../platforms/$rows[5]'>$rows[4]</a></th>
            </tr>
            ";
          }
        } elseif (isset($plannedBtn)) {
          $stmt = $connection->query("SELECT g.title, g.pagePath, g.imgCover, l.refStatus, p.name, p.pagePath, l.score FROM list l, user u, status s, game g, platform p WHERE l.refUser = $userId AND l.refUser = u.uNo AND l.refGame = g.gNo AND p.pNo = g.orgPlatform AND l.refStatus = s.statNo AND l.refStatus = 6 ORDER BY l.refStatus");
          while ($rows = $stmt->fetch()) {
            $i++;
            if ($rows[3] == 2) {
              $colorTag = "style='background-color: $statusColors[2]";
            } elseif ($rows[3] == 3) {
              $colorTag = "style='background-color: $statusColors[3]";
            } elseif ($rows[3] == 4) {
              $colorTag = "style='background-color: $statusColors[4]";
            } elseif ($rows[3] == 5) {
              $colorTag = "style='background-color: $statusColors[5]";
            } elseif ($rows[3] == 6) {
              $colorTag = "style='background-color: $statusColors[6]";
            }
            echo "
            <tr>
                <th><div $colorTag; height: 210px; width: 5px'></div></th>
                <th>$i</th>
                <th style='padding: 5px'><a href='../games/$rows[1]'><img alt='$rows[0]' src='../$rows[2]'></a></th>
                <th><a href='../games/$rows[1]'>$rows[0]</a></th>
                <th>$rows[6]</th>
                <th><a href='../platforms/$rows[5]'>$rows[4]</a></th>
            </tr>
            ";
          }
        }
      } else {
        $stmt = $connection->query("SELECT g.title, g.pagePath, g.imgCover, l.refStatus, p.name, p.pagePath, l.score FROM list l, user u, status s, game g, platform p WHERE l.refUser = $userId AND l.refUser = u.uNo AND l.refGame = g.gNo AND p.pNo = g.orgPlatform AND l.refStatus = s.statNo ORDER BY l.refStatus");
        while ($rows = $stmt->fetch()) {
          $i++;
          if ($rows[3] == 2) {
            $colorTag = "style='background-color: $statusColors[2]";
          } elseif ($rows[3] == 3) {
            $colorTag = "style='background-color: $statusColors[3]";
          } elseif ($rows[3] == 4) {
            $colorTag = "style='background-color: $statusColors[4]";
          } elseif ($rows[3] == 5) {
            $colorTag = "style='background-color: $statusColors[5]";
          } elseif ($rows[3] == 6) {
            $colorTag = "style='background-color: $statusColors[6]";
          }
          echo "
            <tr>
                <th><div $colorTag; height: 210px; width: 5px'></div></th>
                <th>$i</th>
                <th style='padding: 5px'><a href='../games/$rows[1]'><img alt='$rows[0]' src='../$rows[2]'></a></th>
                <th><a href='../games/$rows[1]'>$rows[0]</a></th>
                <th>$rows[6]</th>
                <th><a href='../platforms/$rows[5]'>$rows[4]</a></th>
            </tr>
            ";
        }
      }
      ?>

      </table>

    </div>


  </div>

</div>

</body>

</html>
