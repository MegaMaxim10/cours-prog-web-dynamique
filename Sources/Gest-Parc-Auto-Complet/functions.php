<?php

    function logIn($username, $password) {
        $connect = startConnection();
        $query = $connect->query("SELECT * FROM USER WHERE USER_LOGIN='$username' AND USER_PASSWORD='$password'");
        if($query->num_rows > 0) {
            $_SESSION['username'] = $username;
            return true;
        }
        return false;
    }

    //fonction de connexion a mysqli et a la base de donnees
    function startConnection()
    {
        // parametres de connexion
        $hostname = "localhost";  // nom de votre serveur
        $username = "root";       // nom d'utilisateur (root par défaut) !!! ATTENTION, en utilisant root, vos visiteurs ont tous les droits sur la base
        $password = "projet";     // mot de passe (aucun par défaut mais il est conseillé d'en mettre un)
        $database = "automobile_db";  // nom de votre base de données   

        //connexion au serveur et a la base de donnees
        $hostConnect = new mysqli($hostname, $username, $password, $database);
        if ($hostConnect->connect_errno) 
        {
            die("Failed to connect to MySQL: " . $hostConnect->connect_error);
        }

        return $hostConnect;
    }
    
    //fonction de deconnexion de mysqli
    function stopConnection($con)
    {
        $con->close();
    }
        

    //fonction de verification de connexion
    function isLogged()
    {
        return isset($_SESSION['username']);
    }


    //fonction de suppression d'un automobile
    function deleteAuto($autoId)
    {
        //appel de la fonction de connexion
        $connect = startConnection();
        $query = $connect->query("DELETE FROM AUTOMOBILE WHERE AUTO_ID =$autoId") or die("Erreur lors de la suppression de l'automobile");
        stopConnection($connect);
        return true;
    }


    //fonction d'affichage des automobiles
    function getAllAuto()
    {
        $connect = startConnection();
        //recherche de l'automobile dans la base de donnees
        $query = $connect->query("SELECT * FROM AUTOMOBILE");
        if($query->num_rows > 0) //verifiation que l'automobile existe        
        {
            stopConnection($connect);
            return $query->fetch_all(MYSQLI_ASSOC);
        }
        stopConnection($connect);
        return array();
    }

    //recherche
    function getAuto($autoId){
        $connect = startConnection();
        //recherche de l'automobile dans la base de donnees
        $query = $connect->query("SELECT * FROM AUTOMOBILE WHERE AUTO_ID=$autoId");
        if($query->num_rows > 0) //verifiation que l'automobile existe        
        {
            stopConnection($connect);
            return $query->fetch_assoc();
        }
        stopConnection($connect);
        return null;
    }

     //fonction d'ajout d'un automobile
     function addAuto($autoName, $autoMarque, $autoPrice)
     {
        //appel de la fonction de connexion
        $connect = startConnection();
 
        //enregistrement de l'automobile dans la base de donnees
        $query = $connect->query("INSERT INTO AUTOMOBILE (AUTO_NAME, AUTO_MARK, AUTO_PRICE) VALUES('$autoName', '$autoMarque', $autoPrice)") or die("Erreur lors de l'ajout de l'automobile");
        stopConnection($connect);
        return true;
     }

     //fonction de modification d'un automobile
     function updateAuto($autoName, $autoMarque, $autoPrice, $autoId)
     {
        //appel de la fonction de connexion
        $connect = startConnection();
 
        //enregistrement de l'automobile dans la base de donnees
        $query = $connect->query("UPDATE AUTOMOBILE SET AUTO_NAME='$autoName', AUTO_MARK='$autoMarque', AUTO_PRICE=$autoPrice WHERE AUTO_ID=$autoId") or die("Erreur lors de la mise à jour de l'automobile");
        stopConnection($connect);
        return true;
     }
 
?>