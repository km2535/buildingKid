const { kakao } = window;

export default function Location(search) {
  //넘어온 매개변수를 활용해서 상세 주소의 위치를 보여주면 됨.
  console.log(search);
  const container = document.getElementById("myMap");
  const options = {
    center: new kakao.maps.LatLng(37.497670805986395, 127.02869559980525),
    level: 2,
  };
  const map = new kakao.maps.Map(container, options);

  let imageSrc = "./images/info.png";
  let imageSize = new kakao.maps.Size(85, 70);
  let imageOption = { offset: new kakao.maps.Point(25, 69) };

  const geocoder = new kakao.maps.services.Geocoder();
  //처음 로딩 시 위치
  geocoder.coord2RegionCode(
    127.02869559980525,
    37.497670805986395,
    (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        //console.log("지역 명칭 : " + result[0].address_name);
        //console.log("행정구역 코드 : " + result[0].code);
        buildinguse(result[0].code);
      }
    }
  );
  // 마커 클러스터러를 생성합니다
  // var clusterer = new kakao.maps.MarkerClusterer({
  //   map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
  //   averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  //   minLevel: 5, // 클러스터 할 최소 지도 레벨
  // });

  //지도 이동 이벤트
  kakao.maps.event.addListener(map, "dragend", () => {
    let latlng = map.getCenter();
    //console.log(latlng.getLat());
    geocoder.coord2RegionCode(
      latlng.getLng(),
      latlng.getLat(),
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          //console.log("지역 명칭 : " + result[0].address_name);
          //console.log("행정구역 코드 : " + result[0].code);
          buildinguse(result[0].code);
        }
      }
    );
  });

  async function buildinguse(pnu) {
    const listPnu = [];
    const url =
      " https://apis.data.go.kr/1611000/nsdi/BuildingUseService/attr/getBuildingUse?serviceKey=Wb%2FvEsgW5%2BvHFQNYV35J132SnMNPnw%2BHhXLuPd1b33ok088pnMGTrIMSzHwDyqaZM5P5loQo50ZHj7JsnaMBqQ%3D%3D&pageNo=1&numOfRows=20&pnu=" +
      pnu +
      "&mainPrposCode=04000&format=json";

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log(data.buildingUses.field);
        //console.log(typeof data.buildingUses.field);
        data.buildingUses.field.map((info) => {
          //console.log(info.pnu);
          if (info.buldPlotAr > 0) {
            listPnu.push({
              pnu: info.pnu,
              buldBildngAr: info.buldBildngAr,
              buldPlotAr: info.buldPlotAr,
              ldCodeNm: info.ldCodeNm,
              mnnmSlno: info.mnnmSlno,
            });
          }
        });
      })
      .then(() => {
        // console.log(listPnu);
        listPnu.forEach((info) => {
          const indvd =
            "https://apis.data.go.kr/1611000/nsdi/IndvdLandPriceService/attr/getIndvdLandPriceAttr?serviceKey=Wb%2FvEsgW5%2BvHFQNYV35J132SnMNPnw%2BHhXLuPd1b33ok088pnMGTrIMSzHwDyqaZM5P5loQo50ZHj7JsnaMBqQ%3D%3D&pnu=" +
            info.pnu +
            "&stdrYear=2020&format=json&numOfRows=1&pageNo=1";
          fetch(indvd)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              //console.log(data.indvdLandPrices.field[0].pblntfPclnd);

              geocoder.addressSearch(
                info.ldCodeNm + info.mnnmSlno,
                (result, status) => {
                  if (status === kakao.maps.services.Status.OK) {
                    let coords = new kakao.maps.LatLng(
                      result[0].y,
                      result[0].x
                    );

                    let markerImage = new kakao.maps.MarkerImage(
                      imageSrc,
                      imageSize,
                      imageOption
                    );
                    // 마커 클러스터러를 생성합니다

                    var marker = new kakao.maps.Marker({
                      position: coords,
                      image: markerImage, // 마커이미지 설정
                    });
                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    let content =
                      '<div class="customoverlay" style="color:white;text-align: center; font-size:13px;">' +
                      '    <span class="title">' +
                      Number.parseFloat(Number(info.buldPlotAr) / 3.3).toFixed(
                        1
                      ) +
                      "평" +
                      "</br>" +
                      Number.parseFloat(
                        (Math.round(info.buldBildngAr) *
                          Number(data.indvdLandPrices.field[0].pblntfPclnd)) /
                          100000000
                      ).toFixed(1) +
                      "억" +
                      "</span > " +
                      "</div>";

                    marker.setMap(map);
                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    //map.setCenter(coords);
                    new kakao.maps.CustomOverlay({
                      map: map,
                      position: coords,
                      content: content,
                      yAnchor: 1.3,
                      xAnchor: 0.1,
                    });
                    //clusterer.addMarkers(marker);
                  }
                }
              );
            });
        });
      });
  }
}
