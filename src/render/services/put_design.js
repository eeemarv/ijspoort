import { put_design_person_search } from './design_person';
import { put_design_reg_search } from './design_reg';
import { put_design_tag_search } from './design_tag';

const put_design = () => {
  put_design_person_search();
  put_design_reg_search();
  put_design_tag_search();
};

export { put_design };
