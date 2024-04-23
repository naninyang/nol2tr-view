import Anchor from './Anchor';
import styles from '@/styles/Article.module.sass';

interface Props {
  description: any;
}

export const DescriptionContent = ({ data }: { data: any }) => {
  const renderChildren = (children: any) => {
    return children.map((child: any, index: number) => {
      if (child.type === 'text') {
        if (child.bold) {
          return <strong key={index}>{child.text}</strong>;
        }
        if (child.strikethrough) {
          return <s key={index}>{child.text}</s>;
        }
        if (child.bold === undefined && child.strikethrough === undefined) {
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: child.text.replace(/\n/g, '<br />'),
              }}
            />
          );
        }
      } else if (child.type === 'link') {
        return (
          <Anchor key={index} href={child.url}>
            {renderChildren(child.children)}
          </Anchor>
        );
      }
    });
  };

  const renderContent = (content: any) => {
    return content.map((item: any, index: number) => {
      if (item.type === 'paragraph') {
        return <p key={index}>{renderChildren(item.children)}</p>;
      } else if (item.type === 'list') {
        const List = item.format === 'ordered' ? 'ol' : 'ul';
        return (
          <List key={index}>
            {item.children.map((listItem: any, listItemIndex: number) => (
              <li key={listItemIndex}>{renderChildren(listItem.children)}</li>
            ))}
          </List>
        );
      }
    });
  };
  return <div className={styles.description}>{renderContent(data)}</div>;
};
