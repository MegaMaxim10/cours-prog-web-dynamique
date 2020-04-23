<?php
    session_start();
    require_once "functions.php";
    $state = 0;
    
    if (isset($_GET['logout'])) {
        session_destroy();
    }
    if (isset($_POST['login'])) {
        if (logIn($_POST['login'], $_POST['password'])) {
            header("Location:auto-list.php");
        } else {
            $state = 1;
        }
    }
?>
<!DOCTYPE html5>
<html>
    <head>
        <link href="css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
        <link href="css/style.css" rel="stylesheet">
        <script src="js/bootstrap.min.js"></script>
        <script src="js/jquery.min.js"></script>
    </head>
    <body>
        <div class="wrapper fadeInDown">
            <div id="formContent">
                <!-- Tabs Titles -->
                <?php
                    if ($state == 1) {
                ?>
                    <div class="alert alert-danger" role="alert">
                        La tentative de connexion a échoué !
                    </div>
                <?php
                    }
                ?>

                <!-- Icon -->
                <div class="fadeIn first">
                    <img src="images/user_image2.jpg" id="icon" alt="User Icon" />
                </div>

                <!-- Login Form -->
                <form action="login.php" method="post">
                    <input type="text" id="login" class="fadeIn second" name="login" placeholder="login">
                    <input type="password" id="password" class="fadeIn third" name="password" placeholder="password">
                    <input type="submit" class="fadeIn fourth" value="Log In" id="submit-button">
                </form>
            </div>
        </div>
    </body>
</html>
