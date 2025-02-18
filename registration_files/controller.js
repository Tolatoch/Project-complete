var app = angular.module("ajboapp", []);
app.filter('popid',function(){
      return function(input){
          const pattern = /^\d{13}$/;
          if ( pattern.test(input) ) {
            return  input.substr(0, 1) + " " + 
            input.substr(1, 4) + " " + 
            input.substr(5, 5) + " " + 
            input.substr(10, 2) + " " +
            input.substr(-1,1);
          }else{
            return input ;
          }
      }
});
app.filter('tel',function(){
  return function(input){
      const pattern = /^\d{10}$/; const pattern2 = /^\d{9}$/;
      if ( pattern.test(input) || pattern2.test(input) ) {
        return  input.substr(0, 3) + " " + 
                input.substr(3,3) + " " + 
                input.substr(6) ;
      }else{
        return input ;
      }
  }
});
app.controller("user_crt", ['$scope', '$http', '$timeout',
  function ($scope, $http, $timeout) {

    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
      keyboard: false
    });

    $scope.f = {
      IDCard: '',

    }

    $scope.isIDCardValid = function () {
      if ($scope.f.IDCard) {
        $scope.f.IDCard = $scope.f.IDCard.replace(/[^0-9]/g, '');
      }
    }

    $scope.checkLength = function () {
      if ($scope.f.IDCard) {
        return $scope.f.IDCard.length == 13 && $scope.f.IDCard
      }
    }

    $scope.clearData = function () {
      $scope.f = {};
    }

    $scope.getdata = function () {
      $http({
        method: 'post',
        url: "personal_info2_select_frm.php",
        data: $scope.f,
        headers: { "Content-type": "application/x-www-form-urlencoded" }
      }).then(
        function (A) {
          if (A.data == 'null') {
            $scope.bobo = 'ไม่พบข้อมูลที่ค้นหา'
            console.log(A.data);
            myModal.show();
            return

          }
          $('#table-sample').DataTable().destroy();
          $scope.alltype = A.data;

          $timeout(function () {
            $('#table-sample').DataTable({
              searching: false,
              language: {
                lengthMenu: "แสดง _MENU_ รายการ",
                info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
                paginate: {
                  previous: "ก่อนหน้า",
                  next: "ถัดไป"
                }
              }
            });
          })

        },

        function (A) { }
      );
    }

    $scope.box = function () {

      $http({
        method: 'post',
        url: "educationlist.php",
        data: $scope.f,
        headers: { "Content-type": "application/x-www-form-urlencoded" }
      }).then(
        function (A) {
          $scope.educationlist = A.data;
        },
        function (A) { }
      );
      $http({
        method: 'post',
        url: "s_income.php",
        data: $scope.f,
        headers: { "Content-type": "application/x-www-form-urlencoded" }
      }).then(
        function (A) {
          $scope.incomelist = A.data;
        },
        function (A) { }
      );
      $http({
        method: 'post',
        url: "status.php",
        data: $scope.f,
        headers: { "Content-type": "application/x-www-form-urlencoded" }
      }).then(
        function (A) {
          $scope.statuslist = A.data;
        },
        function (A) { }
      );
    }

    $scope.senddata = function () {

      if ($scope.checkLength() == false || $scope.f.IDCard == undefined) {

        $scope.bobo = 'กรุณากรอกบัตรประชาชนให้ถูกต้อง'
        myModal.show();
        return
      }


      $http({
        method: 'post',
        url: "personal_info2_insert.php",
        data: $scope.f,
        headers: { "Content-type": "application/x-www-form-urlencoded" }
      }).then(
        function (A) {

          if (A.data == 1) {
            $scope.bobo = "บันทึกสำเร็จ";
            $scope.f = {};

          } else if (A.data == 2) {
            $scope.bobo = "มีข้อมูลนี้ในระบบแล้ว";
          } else if (A.data == 0) {
            $scope.bobo = "บันทึกไม่สำเร็จ";
          } else {
            $scope.bobo = "ข้อผิดพลาดจากระบบ";
          }

          myModal.show();
          $scope.getdata();
        },
        function (B) { }
      );
    }


    $scope.confirm_del = function (param) {
      $scope.clearData();
      $scope.del = param
      var myModal = new bootstrap.Modal(document.getElementById('checkdel'), {
        keyboard: false

      });
      myModal.show()

    }

    $scope.deldata = function (will_be_deleted) {
      console.log(will_be_deleted)
      $http({
        method: 'post',
        url: "personal_info2_delete.php",
        data: { pn: will_be_deleted },
        headers: { "Content_Type": "application/x-www-form-urlencoded" }

      }).then(
        function (A) {

          if (A.data == 1) {
            $scope.bobo = "ลบสำเร็จ";
          } else {
            $scope.bobo = "ลบไม่สำเร็จ";
          }
          myModal.show();
          $scope.getdata();
          // window.location.reload();

        },

        function (B) {

        }
      );
    }

    $scope.updateForm = function (param) {
      console.log(param);

      $scope.f = {};
      $scope.f.IDCard = param.IDCard;
      $scope.f.prefix = param.prefix;
      $scope.f.firstName = param.firstName;
      $scope.f.lastName = param.lastName;
      $scope.f.age = parseInt(param.age);
      $scope.f.Num_Home = parseInt(param.Num_Home);
      $scope.f.Moo = parseInt(param.Moo);
      $scope.f.role = parseInt(param.role);
      $scope.f.phone = param.phone.toString();



      $scope.box()
      var myModal = new bootstrap.Modal(document.getElementById('xyz'), {
        keyboard: false

      });
      myModal.show();
    }

    $scope.update = function () {
      $http({
        method: 'post',
        url: "personal_info2_update.php",
        data: $scope.f,
        headers: { "Content-type": "application/x-www-form-urlencoded" }
      }).then(
        function (A) {


          if (A.data == 1) {
            $scope.bobo = "แก้ไขสำเร็จ";
          } else if (A.data == 2) {
            $scope.bobo = "มีข้อมูลนี้ในระบบแล้ว";
          } else if (A.data == 0) {
            $scope.bobo = "ระบบไม่ได้รับข้อมูลใหม่ !";
          } else {
            $scope.bobo = "เกิดข้อผิดพลาดจากระบบ!";
          }
          myModal.show();
          $scope.getdata();
        },

        function (B) {

        }
      );
    }











  }]);



