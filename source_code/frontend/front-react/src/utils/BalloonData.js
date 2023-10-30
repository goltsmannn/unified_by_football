function prepareBalloonData(plc_json){
    let pictures = [];
    let avg = 0.0, cnt = 0;

    plc_json.reviews.forEach(review=>{
        avg += review.rating;
        cnt += 1;
        review.pictures.forEach(picture=>{
            if(pictures.length < 3){
            pictures.push(picture);
            }
        });
    });
    const data = {
        picture: plc_json.main_image,
        rating: cnt?avg/cnt: null,
    }
    return data;
}

export default prepareBalloonData;