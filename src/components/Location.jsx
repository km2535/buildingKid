const { kakao } = window;

export default function Location(search, type) {
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

  //지도 타입을 결정함
  const mapTypes = {
    terrain: kakao.maps.MapTypeId.TERRAIN,
    traffic: kakao.maps.MapTypeId.TRAFFIC,
    bicycle: kakao.maps.MapTypeId.BICYCLE,
    useDistrict: kakao.maps.MapTypeId.USE_DISTRICT,
  };
  for (let key in mapTypes) {
    map.removeOverlayMapTypeId(mapTypes[key]);
  }
  if (type.district) {
    map.addOverlayMapTypeId(mapTypes.useDistrict);
  }
  // 지형정보 체크박스가 체크되어있으면 지도에 지형정보 지도타입을 추가합니다
  if (type.terrain) {
    map.addOverlayMapTypeId(mapTypes.terrain);
  }
  // 교통정보 체크박스가 체크되어있으면 지도에 교통정보 지도타입을 추가합니다
  if (type.traffic) {
    map.addOverlayMapTypeId(mapTypes.traffic);
  }
  // 자전거도로정보 체크박스가 체크되어있으면 지도에 자전거도로정보 지도타입을 추가합니다
  if (type.bicycle) {
    map.addOverlayMapTypeId(mapTypes.bicycle);
  }

  //위치 정보를 통한 맵 로딩(그렇게 정확하지는 않음.)
  if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도
      const locPosition = new kakao.maps.LatLng(lat, lon);
      map.setCenter(locPosition);
      //console.log(locPosition);
    });
  } else {
    // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    const locPosition = new kakao.maps.LatLng(
      37.497670805986395,
      127.02869559980525
    );
    map.setCenter(locPosition);
  }
  //지도 검색 이벤트
  const ps = new kakao.maps.services.Places();
  if (search != null) {
    ps.keywordSearch(search, placesSearchCB);
    function placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setMaxLevel(5);
        map.setBounds(bounds);
      }
    }
  }

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

                    let marker = new kakao.maps.Marker({
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
