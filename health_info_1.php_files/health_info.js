angular.module('healthInfoApp', [])
    .controller('healthInfoAppCtrl', ['$scope', '$http', function ($scope, $http) {
        //ทะเบียนหมู่บ้าน
        $scope.mooOptions = [
            { value: '4', label: 'หมู่4', isChecked: false },
            { value: '5', label: 'หมู่5', isChecked: false },
            { value: '6', label: 'หมู่6', isChecked: false },
            { value: '8', label: 'หมู่8', isChecked: false },
            { value: '9', label: 'หมู่9', isChecked: false },
            { value: '11', label: 'หมู่11', isChecked: false },
            { value: '13', label: 'หมู่13', isChecked: false },
            { value: '15', label: 'หมู่15', isChecked: false },
            { value: '17', label: 'หมู่ที่17', isChecked: false }
        ];
        $scope.f = {
            MooForCheckbox: [],
            MooForRadio: null,
            year: {},
        }
   

        $scope.prepareData = function () {
            $scope.f.year = $scope.yearOptions.filter(items => items.isChecked == true)
          
        }

        $scope.getYear = function () {
            $http({
                method: 'post',
                url: "year.php",
                data: null,
                headers: { "Content-type": "application/x-www-form-urlencoded" }
            }).then(
                function (A) {

                    $scope.yearOptions = A.data.map(item => {
                        return { ...item, isChecked: false }
                    })

                    console.log($scope.yearOptions);


                }
            );
        }
        $scope.getData = function () {
          if ($scope.f.MooForRadio == null || $scope.f.year == {}){
            return;
          }
            $http({
              method: 'post',
              url: "health_info_1_data.php",
              data: $scope.f,
              headers: { "Content-type": "application/x-www-form-urlencoded" }
            }).then(
              function (A) {
                console.log(A.data)
                if (A.data == 'null' || A.data == '') {
                  $scope.bobo = 'ไม่พบข้อมูลที่ค้นหา';
                  myModal.show();
                  return;     
                }
                $('.table-abc').DataTable().destroy();
                $scope.dataTab1 = A.data;
      
                $timeout(function () {
                  $('.table-abc').DataTable({
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
      
    
    }]);