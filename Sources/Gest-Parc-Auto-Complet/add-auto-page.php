<?php
  session_start();
  require_once "functions.php";
  $state = 0;
  $auto = null;

  if (!isLogged()) {
    header("Location:login.php");
  } else {
    require_once "header.php";
    if (isset($_POST['auto_name'])) {
      $result = false;
      if (isset($_GET['auto_id']))
        $result = updateAuto($_POST['auto_name'], $_POST['auto_mark'], $_POST['auto_price'], $_GET['auto_id']);
      else
        $result = addAuto($_POST['auto_name'], $_POST['auto_mark'], $_POST['auto_price']);
      if ($result) {
        $state = 1;
      } else {
        $state = 2;
      }
    }
    if (isset($_GET['auto_id'])) {
      $auto = getAuto($_GET['auto_id']);
    }
?>
<!------ Include the above in your HEAD tag ---------->
<div class="container">
  <?php
    if ($state == 1) {
  ?>
    <div class="alert alert-success" role="alert">
      L'automobile a été enregistré avec succès !
    </div>
  <?php
    }
  ?>
  <?php
    if ($state == 2) {
  ?>
    <div class="alert alert-danger" role="alert">
      L'enregistrement de l'automobile a échoué !
    </div>
  <?php
    }
  ?>
  <form class="form-horizontal" action="add-auto-page.php<?php echo $auto != null ? "?auto_id=" . $_GET['auto_id'] : "" ?>" method="post">
    <fieldset>
      <div id="legend">
        <legend class=""><?php echo $auto == null ? "Ajouter" : "Modifier" ?> un automobile</legend>
      </div>
      <div class="control-group">
        <!-- Username -->
        <label class="control-label"  for="auto_name">Nom de l'automobile</label>
        <div class="controls">
          <input type="text" id="auto_name" name="auto_name" placeholder="" class="input-xlarge" value="<?php echo $auto != null ? $auto['AUTO_NAME'] : "" ?>">
          <p class="help-block">Saisir le nom de l'automobile à enregistrer</p>
        </div>
      </div>
  
      <div class="control-group">
        <!-- E-mail -->
        <label class="control-label" for="auto_mark">Marque de l'automobile</label>
        <div class="controls">
          <input type="text" id="auto_mark" name="auto_mark" placeholder="" class="input-xlarge" value="<?php echo $auto != null ? $auto['AUTO_MARK'] : "" ?>">
          <p class="help-block">Saisir la marque de la voiture</p>
        </div>
      </div>
  
      <div class="control-group">
        <!-- Password-->
        <label class="control-label" for="auto_price">Prix</label>
        <div class="controls">
          <input type="number" id="auto_price" name="auto_price" placeholder="" class="input-xlarge" value="<?php echo $auto != null ? $auto['AUTO_PRICE'] : "" ?>">
          <p class="help-block">Veuillez saisir le prix de l'automobile</p>
        </div>
      </div>
  
      <div class="control-group">
        <!-- Button -->
        <div class="controls">
          <button class="btn" id="submit-button"><?php echo $auto == null ? "Ajouter" : "Modifier" ?></button>
        </div>
      </div>
    </fieldset>
  </form>
</div>

<?php
    include "footer.php";
  }
?>