import Input from './Input';
import EditableContent from './EditableContent';
import { TypeFormThreadCreate } from './types/auth-form-input.type';

const FormThreadCreate = ({
  title,
  onChangeTitle,
  onInputBody,
  category,
  onChangeCategory,
  handleCreateThread,
  error,
  isLoading,
}) => {
  return (
    <>
      <div className="min-h-[1.5rem] text-center mb-1">
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <form method="post" className="flex flex-col gap-3">
        <Input
          label="Title"
          value={title}
          changeHandler={onChangeTitle}
          className="input-sm p-4 rounded-lg focus:outline-2 focus:outline-accent bg-base-100"
        />
        <Input
          label="Category"
          value={category}
          changeHandler={onChangeCategory}
          className="input-sm p-4 rounded-lg focus:outline-2 focus:outline-accent bg-base-100"
        />
        <EditableContent
          placeholder="Write your thread body here..."
          onInput={onInputBody}
        />
        <button
          type="submit"
          className="btn btn-accent"
          onClick={handleCreateThread}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </>
  );
};

FormThreadCreate.propTypes = TypeFormThreadCreate;

export default FormThreadCreate;
