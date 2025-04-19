import { forwardRef, useState, useEffect } from 'react';
import { FormContainer } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import StickyFooter from '@/components/shared/StickyFooter';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BASE_URL } from '@/constants/app.constant';
import AdaptableCard from '@/components/shared/AdaptableCard';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Field, FieldArray, FormikErrors, FormikTouched } from 'formik';
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import DatePicker from '@/components/ui/DatePicker';
import { createEstimation } from '../api/api';

type FormikRef = FormikProps<any>;

interface IMaterialItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ILabourItem {
  designation: string;
  days: number;
  price: number;
  total: number;
}

interface ITermsItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InitialData {
  _id?: string;
  dateOfEstimation: Date;
  workStartDate: Date;
  workEndDate: Date;
  validUntil: Date;
  paymentDueBy: number;
  status: string;
  estimationNumber?: string;
  materials: IMaterialItem[];
  labourCharges: ILabourItem[];
  termsAndConditions: ITermsItem[];
  estimatedAmount: number;
  quotationAmount?: number;
  commissionAmount?: number;
  profit?: number;
  preparedByName: string;
  checkedByName: string;
  approvedByName: string;
}

export type FormModel = InitialData;

type EstimationFormProps = {
  onDiscard?: () => void;
};

const validationSchema = Yup.object().shape({
  dateOfEstimation: Yup.date().required('Estimation Date is required'),
  workStartDate: Yup.date()
    .required('Work Start Date is required')
    .min(Yup.ref('dateOfEstimation'), 'Work Start Date cannot be before Estimation Date'),
  workEndDate: Yup.date()
    .required('Work End Date is required')
    .min(Yup.ref('workStartDate'), 'Work End Date cannot be before Work Start Date'),
  validUntil: Yup.date()
    .required('Valid Until Date is required')
    .min(Yup.ref('dateOfEstimation'), 'Valid Until Date cannot be before Estimation Date'),
  paymentDueBy: Yup.string().required('Payment Due  is required'),
  status: Yup.string().required('Status is required'),
  materials: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required('Material name is required'),
      quantity: Yup.number()
        .required('Quantity is required')
        .min(0, 'Quantity must be positive'),
      unitPrice: Yup.number()
        .required('Unit price is required')
        .min(0, 'Unit price must be positive'),
    })
  ),
  labourCharges: Yup.array().of(
    Yup.object().shape({
      designation: Yup.string().required('Designation is required'),
      days: Yup.number()
        .required('Days is required')
        .min(0, 'Days must be positive'),
      price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be positive'),
    })
  ),
  termsAndConditions: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required('Description is required'),
      quantity: Yup.number()
        .required('Quantity is required')
        .min(0, 'Quantity must be positive'),
      unitPrice: Yup.number()
        .required('Unit price is required')
        .min(0, 'Unit price must be positive'),
    })
  ),
  preparedByName: Yup.string().required('Prepared by is required'),
  checkedByName: Yup.string().required('Checked by is required'),
  approvedByName: Yup.string().required('Approved by is required'),
});

const EstimationForm = forwardRef<FormikRef, EstimationFormProps>((props, ref) => {
  const { onDiscard } = props;
  const navigate = useNavigate();
  
  const {state:projectId}=useLocation()
  
  const [initialValues, setInitialValues] = useState<FormModel>({
    dateOfEstimation: new Date(),
    workStartDate: new Date(),
    workEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    paymentDueBy: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'Draft',
    materials: [
      { description: '', quantity: 0, unitPrice: 0, total: 0 },
    ],
    labourCharges: [
      { designation: '', days: 0, price: 0, total: 0 },
    ],
    termsAndConditions: [
      { description: '', quantity: 0, unitPrice: 0, total: 0 },
    ],
    estimatedAmount: 0,
    preparedByName: '',
    checkedByName: '',
    approvedByName: '',
  });
  // const [isLoading, setIsLoading] = useState(!!id);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
   
  }, [ navigate]);

  const handleFormSubmit = async (values: FormModel) => {
    
    try {
          const response:AxiosResponse = await createEstimation({
            project:projectId,
            paymentDueBy:values.paymentDueBy,
            termsAndConditions:values.termsAndConditions,
            validUntil:values.validUntil,
            materials:values.materials,
            labour:values.labourCharges,
            workEndDate:values.workEndDate,
            workStartDate:values.workStartDate,
            commissionAmount:values.commissionAmount,
            quotationAmount:values.quotationAmount
            })
            console.log(response);
            
      

      toast.push(
        <Notification 
          title={`Estimation Created`} 
          type="success" 
          duration={2500}
        >
          Estimation created successfully.
        </Notification>,
        { placement: 'top-center' }
      );

      navigate('/app/estimation-list');
    } catch (error) {
      console.error(`Error'} estimation:`, error);
      if (error.status === 400){
        toast.push(
          <Notification 
            title={`Not Created`} 
            type="danger" 
            duration={2500}
          >
           Only one estimation is allowed per project.
          </Notification>,
          { placement: 'top-center' }
        );
      }else{
        toast.push(
          <Notification title="Error" type="danger" duration={2500}>
            Failed to estimation. Please try again.
          </Notification>,
          { placement: 'top-center' }
        );
      }

      
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Formik
      innerRef={ref}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ values, touched, errors, isSubmitting, setFieldValue, handleChange }) => {
        // Calculate totals whenever values change
        useEffect(() => {
          // Calculate materials totals
          values.materials.forEach((material, index) => {
            const total = parseFloat((material.quantity * material.unitPrice).toFixed(2));
            if (material.total !== total) {
              setFieldValue(`materials[${index}].total`, total);
            }
          });

          // Calculate labour totals
          values.labourCharges.forEach((labour, index) => {
            const total = parseFloat((labour.days * labour.price).toFixed(2));
            if (labour.total !== total) {
              setFieldValue(`labourCharges[${index}].total`, total);
            }
          });

          // Calculate terms totals
          values.termsAndConditions.forEach((term, index) => {
            const total = parseFloat((term.quantity * term.unitPrice).toFixed(2));
            if (term.total !== total) {
              setFieldValue(`termsAndConditions[${index}].total`, total);
            }
          });

          // Calculate estimated amount
          const materialsTotal = values.materials.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
          const labourTotal = values.labourCharges.reduce((sum, item) => sum + (item.days * item.price), 0);
          const termsTotal = values.termsAndConditions.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
          const estimatedAmount = parseFloat((materialsTotal + labourTotal + termsTotal).toFixed(2));

          if (values.estimatedAmount !== estimatedAmount) {
            setFieldValue('estimatedAmount', estimatedAmount);
          }

          // Calculate profit if quotation and commission amounts exist
          if (values.quotationAmount !== undefined && values.commissionAmount !== undefined) {
            const profit = parseFloat((values.quotationAmount - estimatedAmount - values.commissionAmount).toFixed(2));
            if (values.profit !== profit) {
              setFieldValue('profit', profit);
            }
          }
        }, [values.materials, values.labourCharges, values.termsAndConditions, values.quotationAmount, values.commissionAmount]);

        const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e);
          const { name, value } = e.target;
          setFieldValue(name, parseFloat(value) || 0);
        };

        return (
          <Form>
            <FormContainer>
              <AdaptableCard divider className="mb-4">
                <h5>Work Details</h5>
                <p className="mb-6">Section to configure client and work information</p>

                

                

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormItem
                    label="Work Start Date *"
                    invalid={!!errors.workStartDate && touched.workStartDate}
                    errorMessage={errors.workStartDate as string}
                  >
                    <Field name="workStartDate">
                      {({ field, form }: any) => (
                        <DatePicker
                          placeholder="Select date"
                          value={field.value}
                          onChange={(date) => {
                            form.setFieldValue(field.name, date);
                          }}
                          minDate={values.dateOfEstimation}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    label="Work End Date *"
                    invalid={!!errors.workEndDate && touched.workEndDate}
                    errorMessage={errors.workEndDate as string}
                  >
                    <Field name="workEndDate">
                      {({ field, form }: any) => (
                        <DatePicker
                          placeholder="Select date"
                          value={field.value}
                          onChange={(date) => {
                            form.setFieldValue(field.name, date);
                          }}
                          minDate={values.workStartDate}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    label="Valid Until *"
                    invalid={!!errors.validUntil && touched.validUntil}
                    errorMessage={errors.validUntil as string}
                  >
                    <Field name="validUntil">
                      {({ field, form }: any) => (
                        <DatePicker
                          placeholder="Select date"
                          value={field.value}
                          onChange={(date) => {
                            form.setFieldValue(field.name, date);
                          }}
                          minDate={values.dateOfEstimation}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
  label="Payment Due By *"
  invalid={!!errors.paymentDueBy && touched.paymentDueBy}
  errorMessage={errors.paymentDueBy as string}
>
  <Field
    type="number"
    name="paymentDueBy"
    placeholder="paymentDueBy"
    component={Input}
  />
</FormItem>
                </div>

                {/* {id && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem label="Estimation Number">
                      <Input
                        readOnly
                        value={values.estimationNumber}
                        placeholder="Estimation Number"
                      />
                    </FormItem>
                    <FormItem
                      label="Status *"
                      invalid={!!errors.status && touched.status}
                      errorMessage={errors.status}
                    >
                      <Field
                        as="select"
                        name="status"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-[#1f2937] dark:border-gray-600 dark:text-white"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Converted">Converted to Job</option>
                      </Field>
                    </FormItem>
                  </div>
                )} */}
              </AdaptableCard>

              <AdaptableCard divider className="mb-4">
                <h5>Materials</h5>
                <p className="mb-6">List of materials required for the project</p>

                <FieldArray name="materials">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.materials.map((material, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4">
                          <FormItem
                            label={`Material ${index + 1}`}
                            invalid={!!errors.materials?.[index]?.description && touched.materials?.[index]?.description}
                            errorMessage={errors.materials?.[index]?.description}
                          >
                            <Field
                              type="text"
                              name={`materials[${index}].description`}
                              placeholder="Material name"
                              component={Input}
                            />
                          </FormItem>

                          <FormItem
                            label="Quantity"
                            invalid={!!errors.materials?.[index]?.quantity && touched.materials?.[index]?.quantity}
                            errorMessage={errors.materials?.[index]?.quantity}
                          >
                            <Field
                              type="number"
                              name={`materials[${index}].quantity`}
                              placeholder="Quantity"
                              component={Input}
                              min={0}
                              onChange={handleFieldChange}
                            />
                          </FormItem>

                          <FormItem
                            label="Unit Price"
                            invalid={!!errors.materials?.[index]?.unitPrice && touched.materials?.[index]?.unitPrice}
                            errorMessage={errors.materials?.[index]?.unitPrice}
                          >
                            <Field
                              type="number"
                              name={`materials[${index}].unitPrice`}
                              placeholder="Unit price"
                              component={Input}
                              min={0}
                              onChange={handleFieldChange}
                            />
                          </FormItem>

                          <FormItem label="Total">
                            <Input
                              readOnly
                              value={material.total}
                              placeholder="Total"
                            />
                          </FormItem>

                          <div className="flex justify-end">
                            {values.materials.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="plain"
                                color="red"
                                icon={<HiOutlineTrash />}
                                onClick={() => remove(index)}
                              />
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlus />}
                        onClick={() => push({ description: '', quantity: 0, unitPrice: 0, total: 0 })}
                      >
                        Add Material
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </AdaptableCard>

              <AdaptableCard divider className="mb-4">
                <h5>Labour Charges</h5>
                <p className="mb-6">List of labour charges for the project</p>

                <FieldArray name="labourCharges">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.labourCharges.map((labour, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4">
                          <FormItem
                            label={`Designation ${index + 1}`}
                            invalid={!!errors.labourCharges?.[index]?.designation && touched.labourCharges?.[index]?.designation}
                            errorMessage={errors.labourCharges?.[index]?.designation}
                          >
                            <Field
                              type="text"
                              name={`labourCharges[${index}].designation`}
                              placeholder="Designation"
                              component={Input}
                            />
                          </FormItem>

                          <FormItem
                            label="Days"
                            invalid={!!errors.labourCharges?.[index]?.days && touched.labourCharges?.[index]?.days}
                            errorMessage={errors.labourCharges?.[index]?.days}
                          >
                            <Field
                              type="number"
                              name={`labourCharges[${index}].days`}
                              placeholder="Days"
                              component={Input}
                              min={0}
                              onChange={handleFieldChange}
                            />
                          </FormItem>

                          <FormItem
                            label="Price"
                            invalid={!!errors.labourCharges?.[index]?.price && touched.labourCharges?.[index]?.price}
                            errorMessage={errors.labourCharges?.[index]?.price}
                          >
                            <Field
                              type="number"
                              name={`labourCharges[${index}].price`}
                              placeholder="Price per day"
                              component={Input}
                              min={0}
                              onChange={handleFieldChange}
                            />
                          </FormItem>

                          <FormItem label="Total">
                            <Input
                              readOnly
                              value={labour.total}
                              placeholder="Total"
                            />
                          </FormItem>

                          <div className="flex justify-end">
                            {values.labourCharges.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="plain"
                                color="red"
                                icon={<HiOutlineTrash />}
                                onClick={() => remove(index)}
                              />
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlus />}
                        onClick={() => push({ designation: '', days: 0, price: 0, total: 0 })}
                      >
                        Add Labour Charge
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </AdaptableCard>

              <AdaptableCard divider className="mb-4">
                <h5>Terms & Conditions</h5>
                <p className="mb-6">Additional terms and conditions for the project</p>

                <FieldArray name="termsAndConditions">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.termsAndConditions.map((term, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4">
                          <FormItem
                            label={`Description ${index + 1}`}
                            invalid={!!errors.termsAndConditions?.[index]?.description && touched.termsAndConditions?.[index]?.description}
                            errorMessage={errors.termsAndConditions?.[index]?.description}
                          >
                            <Field
                              type="text"
                              name={`termsAndConditions[${index}].description`}
                              placeholder="Description"
                              component={Input}
                            />
                          </FormItem>

                          <FormItem
                            label="Quantity"
                            invalid={!!errors.termsAndConditions?.[index]?.quantity && touched.termsAndConditions?.[index]?.quantity}
                            errorMessage={errors.termsAndConditions?.[index]?.quantity}
                          >
                            <Field
                              type="number"
                              name={`termsAndConditions[${index}].quantity`}
                              placeholder="Quantity"
                              component={Input}
                              min={0}
                              onChange={handleFieldChange}
                            />
                          </FormItem>

                          <FormItem
                            label="Unit Price"
                            invalid={!!errors.termsAndConditions?.[index]?.unitPrice && touched.termsAndConditions?.[index]?.unitPrice}
                            errorMessage={errors.termsAndConditions?.[index]?.unitPrice}
                          >
                            <Field
                              type="number"
                              name={`termsAndConditions[${index}].unitPrice`}
                              placeholder="Unit price"
                              component={Input}
                              min={0}
                              onChange={handleFieldChange}
                            />
                          </FormItem>

                          <FormItem label="Total">
                            <Input
                              readOnly
                              value={term.total}
                              placeholder="Total"
                            />
                          </FormItem>

                          <div className="flex justify-end">
                            {values.termsAndConditions.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="plain"
                                color="red"
                                icon={<HiOutlineTrash />}
                                onClick={() => remove(index)}
                              />
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePlus />}
                        onClick={() => push({ description: '', quantity: 0, unitPrice: 0, total: 0 })}
                      >
                        Add Term
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </AdaptableCard>

              <AdaptableCard divider className="mb-4">
                <h5>Summary</h5>
                <p className="mb-6">Final amounts and approvals</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <FormItem label="Estimated Amount">
                    <Input
                      readOnly
                      name="estimatedAmount"
                      value={values.estimatedAmount}
                      placeholder="Estimated amount"
                    />
                  </FormItem>

                  <FormItem label="Quotation Amount (Optional)">
                    <Field
                      type="number"
                      name="quotationAmount"
                      placeholder="Quotation amount"
                      component={Input}
                      min={0}
                      onChange={handleFieldChange}
                    />
                  </FormItem>

                  <FormItem label="Commission Amount (Optional)">
                    <Field
                      type="number"
                      name="commissionAmount"
                      placeholder="Commission amount"
                      component={Input}
                      min={0}
                      onChange={handleFieldChange}
                    />
                  </FormItem>

                  {values.quotationAmount !== undefined && values.commissionAmount !== undefined && (
                    <FormItem label="Profit">
                      <Input
                        readOnly
                        name="profit"
                        value={values.profit || 0}
                        placeholder="Profit"
                      />
                    </FormItem>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormItem
                    label="Prepared By *"
                    invalid={!!errors.preparedByName && touched.preparedByName}
                    errorMessage={errors.preparedByName}
                  >
                    <Field
                      type="text"
                      name="preparedByName"
                      placeholder="Prepared by name"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    label="Checked By *"
                    invalid={!!errors.checkedByName && touched.checkedByName}
                    errorMessage={errors.checkedByName}
                  >
                    <Field
                      type="text"
                      name="checkedByName"
                      placeholder="Checked by name"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    label="Approved By *"
                    invalid={!!errors.approvedByName && touched.approvedByName}
                    errorMessage={errors.approvedByName}
                  >
                    <Field
                      type="text"
                      name="approvedByName"
                      placeholder="Approved by name"
                      component={Input}
                    />
                  </FormItem>
                </div>
              </AdaptableCard>

              <StickyFooter
                className="-mx-8 px-8 flex items-center justify-between py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div>
                  <Button
                    size="sm"
                    className="ltr:mr-3 rtl:ml-3"
                    type="button"
                    onClick={onDiscard}
                  >
                    Discard
                  </Button>
                </div>
                <div className='md:flex grid-2 gap-2'>
                <div className="md:flex ">
                  
                </div>
                <div className="md:flex">
                  <Button
                    size="sm"
                    variant="solid"
                    loading={isSubmitting}
                    type="submit"
                  >
                    {/* {id ? 'Update Estimation' : 'Completed'} */}
                    Save
                  </Button>
                </div>
                </div>
               
              </StickyFooter>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
});

EstimationForm.displayName = 'EstimationForm';

export default EstimationForm;