<?php
  session_start();
  require_once "functions.php";

  if (!isLogged()) {
    header("Location:login.php");
  } else {
    header("Location:auto-list.php");
  }
?>