import { db_person } from './db';
import lodash from 'lodash';

const design_person_search_doc = {
  _id: '_design/search',
  views: {
    count_by_text: {
      map: ((doc) => {
        let firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        emit(firstname + surname);
        emit(surname + firstname);
        const ks = ['member_id', 'nickname', 'address', 'email', 'email_work', 'phone_mobile', 'phone_home', 'phone_work'];
        ks.forEach((k) => {
          if (doc[k]){
            emit(doc[k].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, ''));
          }
        });
      }).toString(),
      reduce: '_count'
    },
    count_by_member_year: {
      map: ((doc) => {
        if (typeof doc.member_year === 'object'){
          Object.keys(doc.member_year).forEach((yk) => {
            emit(yk.substring(1));
          });
        }
      }).toString(),
      reduce: '_count'
    },
    count_by_name: {
      map: ((doc) => {
        let firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        emit(firstname + surname);
      }).toString(),
      reduce: '_count'
    },
    count_by_date_of_birth: {
      map: ((doc) => {
        let date_of_birth = doc.date_of_birth.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (date_of_birth === ''){
          return;
        }
        emit(date_of_birth);
      }).toString(),
      reduce: '_count'
    },
    count_by_phone_mobile: {
      map: ((doc) => {
        let phone_mobile = doc.phone_mobile.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (phone_mobile === ''){
          return;
        }
        emit(phone_mobile);
      }).toString(),
      reduce: '_count'
    },
    count_by_phone_home: {
      map: ((doc) => {
        let phone_home = doc.phone_home.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (phone_home === ''){
          return;
        }
        emit(phone_home);
      }).toString(),
      reduce: '_count'
    },
    count_by_phone_work: {
      map: ((doc) => {
        let phone_work = doc.phone_work.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (phone_work === ''){
          return;
        }
        emit(phone_work);
      }).toString(),
      reduce: '_count'
    },
    count_by_email: {
      map: ((doc) => {
        let email = doc.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (email === ''){
          return;
        }
        emit(email);
      }).toString(),
      reduce: '_count'
    },
    count_by_email_work: {
      map: ((doc) => {
        let email_work = doc.email_work.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (email_work === ''){
          return;
        }
        emit(email_work);
      }).toString(),
      reduce: '_count'
    },
    count_by_address: {
      map: ((doc) => {
        let address = doc.address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        emit(address);
      }).toString(),
      reduce: '_count'
    }
  }
};

const put_design_person_search = () => {
  db_person.get(design_person_search_doc._id).catch((err) => {
    if (err.name === 'not_found'){
      return 'put';
    }
    throw err;
  }).then((res) => {
    if (res === 'put'){
      return design_person_search_doc;
    }
    let compare_design_doc = {...res};
    delete compare_design_doc._rev;
    if (lodash.isEqual(compare_design_doc, design_person_search_doc)){
      throw 'no change for design_person_search_doc';
    }
    design_person_search_doc._rev = res._rev;
    return design_person_search_doc;
  }).then((res) => {
    return db_person.put(res);
  }).then((res) => {
    console.log('design_person_search_doc updated');
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
};

export { put_design_person_search };
