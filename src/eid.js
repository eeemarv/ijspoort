export default class Eid {
    constructor (eidenv_out_string){
        this.chip_number = '';
        this.card_number = '';
        this.national_number = '';
        this.birth_date = '';
        this.birth_location = '';
        this.first_names = '';
        this.name = '';
        this.initial = '';
        this.valid_from = '';
        this.valid_till = '';
        this.sex = '';
        this.nationality = '';
        this.street_and_number = '';
        this.postcode = '';
        this.municipality = '';
        this.delivering_municipality = '';

        const this_eid = this;

        eidenv_out_string.split(/\r\n|\r|\n/).forEach(function(val){
            if (val.startsWith('BELPIC_')){
                let eid_ary = val.slice(7).split(':');
                let eid_val = eid_ary[1].trim();

                switch(eid_ary[0].trim().toLowerCase()){
                    case 'cardnumber':
                        this_eid.card_number = eid_val;
                        break;
                    case 'chipnumber':
                        this_eid.chip_number = eid_val;
                        break;
                    case 'validfrom':
                        this_eid.valid_from = eid_val;
                        break;
                    case 'validtill':
                        this_eid.valid_till = eid_val;
                        break;
                    case 'deliveringmunicipality':
                        this_eid.delivering_municipality = eid_val;
                        break;
                    case 'nationalnumber':
                        this_eid.national_number = eid_val;
                        break;
                    case 'name':
                        this_eid.name = eid_val;
                        break;
                    case 'firstnames':
                        this_eid.first_names = eid_val;
                        break;
                    case 'initial':
                        this_eid.initial = eid_val;
                        break;
                    case 'nationality':
                        this_eid.nationality = eid_val;
                        break;
                    case 'birthlocation':
                        this_eid.birth_location = eid_val;
                        break;
                    case 'birthdate':
                        this_eid.birth_date = eid_val;
                        break;
                    case 'sex':
                        this_eid.sex = 'FV'.includes(eid_val) ? 'F' : eid_val;
                        break;
                    case 'streetandnumber':
                        this_eid.street_and_number = eid_val;
                        break;
                    case 'zipcode':
                        this_eid.postcode = eid_val;
                        break;
                    case 'municipality':
                        this_eid.municipality = eid_val;
                        break;
                };
            }
        });
    }
}