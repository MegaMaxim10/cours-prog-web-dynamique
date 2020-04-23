<?php
  session_start();
  require_once "functions.php";
  $state = 0;

  if (!isLogged()) {
    header("Location:login.php");
  } else {
    require_once "header.php";

    if (isset($_GET['auto_id'])) {
      if (deleteAuto($_GET['auto_id']))
        $state = 1;
    }

    $autos = getAllAuto();
?>
<div class="container">
  <?php
    if ($state == 1) {
  ?>
    <div class="alert alert-success" role="alert">
      L'automobile a été supprimé avec succès !
    </div>
  <?php
    }
  ?>
  <h2>LISTE D'AUTOMOBILES</h2> 
  <p>Le tableau contient la liste des automobiles et leur caracteristiques enregistrees dans la base de donnees</p>            
  <table class="table table-dark table-hover table-striped">
    <thead>
      <tr>
        <th> IDENTIFIANT DE L'AUTO </th>
        <th>NOM DE L'AUTO</th>
        <th> MARQUE DE L'AUTO</th>
		    <th>PRIX DE L'AUTO</th>
		    <th colspan=2>ACTIONS SUR L'AUTO</th>
      </tr>
    </thead>
    <tbody>
      <?php
        foreach($autos as $auto) {
      ?>
        <tr>
          <td><?php echo $auto['AUTO_ID']; ?></td>
          <td><?php echo $auto['AUTO_NAME']; ?></td>
          <td><?php echo $auto['AUTO_MARK']; ?></td>
          <td><?php echo $auto['AUTO_PRICE']; ?></td>
          <td><a class="btn success" href="add-auto-page.php?auto_id=<?php echo $auto['AUTO_ID']; ?>" class="operation-button"> Modifier</a></td>
          <td><a class="btn danger" href="auto-list.php?auto_id=<?php echo $auto['AUTO_ID']; ?>" class="operation-button"> Supprimer</a></td>
        </tr>
      <?php
        }
      ?>
    </tbody>
  </table>
</div>

<?php
    include 'footer.php';
  }
?>